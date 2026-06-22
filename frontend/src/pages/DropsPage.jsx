import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

// small inline countdown for cards
function CardCountdown({ targetDate }) {
const [timeLeft, setTimeLeft] = useState({})
const [expired, setExpired] = useState(false)

useEffect(() => {
const calc = () => {
const diff = new Date(targetDate) - new Date()
if (diff <= 0) { setExpired(true); return }
setTimeLeft({
hours: Math.floor(diff / (1000 * 60 * 60)),
mins: Math.floor((diff / 1000 / 60) % 60),
secs: Math.floor((diff / 1000) % 60)
})
}
calc()
const interval = setInterval(calc, 1000)
return () => clearInterval(interval)
}, [targetDate])

if (expired) return <span className="text-xs" style={{ color: '#16a34a' }}>Going live now...</span>

return (
<span className="text-xs font-mono font-bold" style={{ color: '#ec4899' }}>
{String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.mins).padStart(2, '0')}m {String(timeLeft.secs).padStart(2, '0')}s
</span>
)
}

function DropsPage() {
const [drops, setDrops] = useState([])
const [loading, setLoading] = useState(true)
const [filter, setFilter] = useState('ALL')

const fetchDrops = async () => {
try {
const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/drops`)
setDrops(res.data)
} catch (err) {
console.error(err)
} finally {
setLoading(false)
}
}

useEffect(() => {
fetchDrops()
// refresh every 60 seconds to update statuses
const interval = setInterval(fetchDrops, 60000)
return () => clearInterval(interval)
}, [])

const filtered = filter === 'ALL' ? drops : drops.filter(d => d.status === filter)

return (
<div style={{ backgroundColor: '#fff5f9', minHeight: '100vh' }}>
<Navbar />

<div className="max-w-6xl mx-auto px-6 py-10">

<div className="mb-10">
<h1 className="text-4xl font-bold" style={{ color: '#1a1a2e' }}>All Drops</h1>
<p className="mt-2" style={{ color: '#9ca3af' }}>
Browse all limited collections — {drops.filter(d => d.status === 'LIVE').length} live now
</p>
</div>

{/* Filter tabs */}
<div className="flex gap-3 mb-8 flex-wrap">
{['ALL', 'LIVE', 'UPCOMING', 'ENDED'].map(tab => (
<button key={tab}
onClick={() => setFilter(tab)}
className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
style={{
backgroundColor: filter === tab ? '#ec4899' : '#ffffff',
color: filter === tab ? '#ffffff' : '#6b7280',
border: '1px solid',
borderColor: filter === tab ? '#ec4899' : '#fce7f3'
}}>
{tab}
{tab === 'LIVE' && drops.filter(d => d.status === 'LIVE').length > 0 && (
<span className="ml-2 px-2 py-0.5 rounded-full text-xs"
style={{ backgroundColor: filter === 'LIVE' ? 'rgba(255,255,255,0.3)' : '#fce7f3', color: filter === 'LIVE' ? '#fff' : '#ec4899' }}>
{drops.filter(d => d.status === 'LIVE').length}
</span>
)}
</button>
))}
</div>

{loading ? (
<div className="flex justify-center py-20">
<div className="w-10 h-10 rounded-full border-4 border-pink-300 border-t-pink-500 animate-spin" />
</div>
) : filtered.length === 0 ? (
<div className="text-center py-20 rounded-3xl"
style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3' }}>
<p className="text-5xl mb-4">🎁</p>
<p className="text-xl font-semibold mb-2" style={{ color: '#1a1a2e' }}>No drops found</p>
<p style={{ color: '#9ca3af' }}>Check back soon for new releases</p>
</div>
) : (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{filtered.map(drop => (
<Link to={`/drops/${drop.slug}`} key={drop.id}>
<div className="rounded-3xl overflow-hidden transition-all hover:scale-105 cursor-pointer"
style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3', boxShadow: '0 2px 12px rgba(236,72,153,0.06)' }}>

<div className="relative h-56 overflow-hidden">
<img src={drop.coverImage} alt={drop.title}
className="w-full h-full object-cover"
onError={e => e.target.src = '/images/drop1.jpg'} />
<div className="absolute inset-0"
style={{ background: 'linear-gradient(to top, rgba(26,26,46,0.5), transparent)' }} />
<div className="absolute top-3 left-3">
<span className="px-3 py-1 rounded-full text-xs font-bold"
style={{
backgroundColor: drop.status === 'LIVE' ? '#ec4899' : drop.status === 'UPCOMING' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)',
color: drop.status === 'LIVE' ? '#ffffff' : drop.status === 'UPCOMING' ? '#ec4899' : '#6b7280'
}}>
{drop.status === 'LIVE' ? '🔴 LIVE' : drop.status === 'UPCOMING' ? '⏳ UPCOMING' : '✅ ENDED'}
</span>
</div>
<div className="absolute bottom-3 left-3 right-3">
<p className="text-white font-bold text-lg leading-tight drop-shadow">{drop.title}</p>
</div>
</div>

<div className="p-5">
<p className="text-sm mb-3 line-clamp-2" style={{ color: '#9ca3af' }}>
{drop.description}
</p>

{/* Countdown for upcoming */}
{drop.status === 'UPCOMING' && (
<div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl"
style={{ backgroundColor: '#fff5f9', border: '1px solid #fce7f3' }}>
<span className="text-xs" style={{ color: '#9ca3af' }}>Live in:</span>
<CardCountdown targetDate={drop.releaseDate} />
</div>
)}

{/* End countdown for live */}
{drop.status === 'LIVE' && (
<div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl"
style={{ backgroundColor: '#fff0f6', border: '1px solid #ec4899' }}>
<span className="text-xs" style={{ color: '#9ca3af' }}>Ends in:</span>
<CardCountdown targetDate={drop.endDate} />
</div>
)}

<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
style={{ backgroundColor: '#ec4899' }}>
{drop.seller?.firstName?.[0]}
</div>
<span className="text-xs" style={{ color: '#6b7280' }}>
{drop.seller?.firstName} {drop.seller?.lastName}
</span>
</div>
<span className="text-sm font-semibold" style={{ color: '#ec4899' }}>
{drop.products.length} items →
</span>
</div>
</div>

</div>
</Link>
))}
</div>
)}
</div>
</div>
)
}

export default DropsPage