import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

function DropsPage() {
const [drops, setDrops] = useState([])
const [loading, setLoading] = useState(true)
const [filter, setFilter] = useState('ALL')

useEffect(() => {
axios.get(`${import.meta.env.VITE_API_URL}/api/drops`)
.then(res => setDrops(res.data))
.catch(console.error)
.finally(() => setLoading(false))
}, [])

const filtered = filter === 'ALL' ? drops : drops.filter(d => d.status === filter)

return (
<div style={{ backgroundColor: '#fff5f9', minHeight: '100vh' }}>
<Navbar />

<div className="max-w-6xl mx-auto px-6 py-10">

<div className="mb-10">
<h1 className="text-4xl font-bold" style={{ color: '#1a1a2e' }}>All Drops</h1>
<p className="mt-2" style={{ color: '#9ca3af' }}>Browse all limited collections</p>
</div>

{/* Filter tabs */}
<div className="flex gap-3 mb-8">
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
</button>
))}
</div>

{loading ? (
<div className="flex justify-center py-20">
<div className="w-10 h-10 rounded-full border-4 border-pink-300 border-t-pink-500 animate-spin" />
</div>
) : filtered.length === 0 ? (
<div className="text-center py-20">
<p className="text-5xl mb-4">🎁</p>
<p className="text-xl font-semibold" style={{ color: '#1a1a2e' }}>No drops found</p>
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
<div className="absolute top-3 left-3">
<span className="px-3 py-1 rounded-full text-xs font-bold"
style={{
backgroundColor: drop.status === 'LIVE' ? '#ec4899' : '#fce7f3',
color: drop.status === 'LIVE' ? '#ffffff' : '#ec4899'
}}>
{drop.status === 'LIVE' ? '🔴 LIVE' : drop.status === 'UPCOMING' ? '⏳ UPCOMING' : '✅ ENDED'}
</span>
</div>
</div>

<div className="p-5">
<h3 className="font-bold text-lg mb-1" style={{ color: '#1a1a2e' }}>{drop.title}</h3>
<p className="text-sm mb-4 line-clamp-2" style={{ color: '#9ca3af' }}>{drop.description}</p>
<div className="flex items-center justify-between">
<span className="text-sm" style={{ color: '#6b7280' }}>
{drop.products.length} product{drop.products.length !== 1 ? 's' : ''}
</span>
<span className="text-sm font-semibold" style={{ color: '#ec4899' }}>View Drop →</span>
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