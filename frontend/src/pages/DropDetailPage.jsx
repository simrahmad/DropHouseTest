import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

// countdown component
function Countdown({ targetDate, onExpire }) {
const [timeLeft, setTimeLeft] = useState({})
const [expired, setExpired] = useState(false)

useEffect(() => {
const calc = () => {
const diff = new Date(targetDate) - new Date()

if (diff <= 0) {
setExpired(true)
setTimeLeft(null)
if (onExpire) onExpire()
return
}

setTimeLeft({
days: Math.floor(diff / (1000 * 60 * 60 * 24)),
hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
mins: Math.floor((diff / 1000 / 60) % 60),
secs: Math.floor((diff / 1000) % 60)
})
}

calc()
const interval = setInterval(calc, 1000)
return () => clearInterval(interval)
}, [targetDate])

if (expired) return null

if (!timeLeft) return null

return (
<div className="flex items-center gap-3 flex-wrap">
{['days', 'hours', 'mins', 'secs'].map(unit => (
<div key={unit} className="flex flex-col items-center px-4 py-3 rounded-2xl"
style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3', minWidth: '64px' }}>
<span className="text-2xl font-bold" style={{ color: '#ec4899' }}>
{String(timeLeft[unit]).padStart(2, '0')}
</span>
<span className="text-xs mt-1" style={{ color: '#9ca3af' }}>{unit}</span>
</div>
))}
</div>
)
}

function DropDetailPage() {
const { slug } = useParams()
const [drop, setDrop] = useState(null)
const [loading, setLoading] = useState(true)

const fetchDrop = useCallback(async () => {
try {
const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/drops/${slug}`)
setDrop(res.data)

// immediately check and update status based on current time
await checkStatus(res.data.id)
} catch (err) {
console.error(err)
} finally {
setLoading(false)
}
}, [slug])

const checkStatus = async (dropId) => {
try {
const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/drops/${dropId}/check-status`)
if (res.data.updated) {
setDrop(res.data.drop)
}
} catch (err) {
console.error(err)
}
}

useEffect(() => {
fetchDrop()
}, [fetchDrop])

// when countdown expires refresh the drop status
const handleCountdownExpire = async () => {
if (!drop) return
await checkStatus(drop.id)
const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/drops/${slug}`)
setDrop(res.data)
}

if (loading) {
return (
<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fff5f9' }}>
<div className="w-10 h-10 rounded-full border-4 border-pink-300 border-t-pink-500 animate-spin" />
</div>
)
}

if (!drop) {
return (
<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fff5f9' }}>
<p style={{ color: '#9ca3af' }}>Drop not found</p>
</div>
)
}

return (
<div style={{ backgroundColor: '#fff5f9', minHeight: '100vh' }}>
<Navbar />

{/* Cover banner */}
<div className="relative w-full overflow-hidden" style={{ height: '420px' }}>
<img src={drop.coverImage} alt={drop.title}
className="w-full h-full object-cover"
onError={e => e.target.src = '/images/drop1.jpg'} />
<div className="absolute inset-0 flex flex-col justify-end px-10 pb-10"
style={{ background: 'linear-gradient(to top, rgba(26,26,46,0.9), transparent)' }}>

<div className="flex items-center gap-3 mb-3 flex-wrap">
<span className="px-3 py-1 rounded-full text-xs font-bold w-fit"
style={{
backgroundColor: drop.status === 'LIVE' ? '#ec4899' : drop.status === 'UPCOMING' ? '#fce7f3' : '#f3f4f6',
color: drop.status === 'LIVE' ? '#ffffff' : drop.status === 'UPCOMING' ? '#ec4899' : '#6b7280'
}}>
{drop.status === 'LIVE' ? '🔴 LIVE NOW' : drop.status === 'UPCOMING' ? '⏳ UPCOMING' : '✅ ENDED'}
</span>
</div>

<h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{drop.title}</h1>

<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
style={{ backgroundColor: '#ec4899' }}>
{drop.seller?.firstName?.[0]}
</div>
<span className="text-white/80 text-sm">
by {drop.seller?.firstName} {drop.seller?.lastName}
</span>
</div>
</div>
</div>

<div className="max-w-6xl mx-auto px-6 py-10">

{/* Status banner */}
{drop.status === 'UPCOMING' && (
<div className="rounded-3xl p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3', boxShadow: '0 2px 12px rgba(236,72,153,0.06)' }}>
<div>
<p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#ec4899' }}>
Drop not live yet
</p>
<h2 className="text-xl font-bold mb-1" style={{ color: '#1a1a2e' }}>
This drop launches on {new Date(drop.releaseDate).toLocaleDateString('en-US', {
weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
})} at {new Date(drop.releaseDate).toLocaleTimeString('en-US', {
hour: '2-digit', minute: '2-digit'
})}
</h2>
<p className="text-sm" style={{ color: '#9ca3af' }}>
Come back when it goes live to shop the collection
</p>
</div>
<div>
<p className="text-xs font-semibold mb-3" style={{ color: '#9ca3af' }}>LAUNCHES IN</p>
<Countdown targetDate={drop.releaseDate} onExpire={handleCountdownExpire} />
</div>
</div>
)}

<br/>
{drop.status === 'LIVE' && (
<div className="rounded-3xl p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
style={{ backgroundColor: '#fff0f6', border: '1px solid #ec4899' }}>
<div>
<p className="text-xs  text-center font-semibold uppercase tracking-widest mb-1" style={{ color: '#ec4899' }}>
🔴 Drop is live now
</p>
<h2 className="text-xl font-bold mb-1 text-center" style={{ color: '#1a1a2e' }}>
Shop before it ends!
</h2>
<p className="text-sm text-center" style={{ color: '#9ca3af' }}>
Ends on {new Date(drop.endDate).toLocaleDateString('en-US', {
weekday: 'long', day: 'numeric', month: 'long'
})} at {new Date(drop.endDate).toLocaleTimeString('en-US', {
hour: '2-digit', minute: '2-digit'
})}
</p>
</div>
<br/>
<div>
<p className="text-xs font-semibold mb-3" style={{ color: '#9ca3af' }}>ENDS IN</p>
<Countdown targetDate={drop.endDate} onExpire={handleCountdownExpire} />
</div>
</div>
)}

{drop.status === 'ENDED' && (
<div className="rounded-3xl p-6 mb-8 text-center"
style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
<p className="text-3xl mb-2">😔</p>
<h2 className="text-xl font-bold mb-1" style={{ color: '#1a1a2e' }}>This drop has ended</h2>
<p style={{ color: '#9ca3af' }}>You missed it this time. Stay tuned for the next drop.</p>
<Link to="/drops">
<button className="mt-4 px-6 py-3 rounded-2xl text-white font-semibold"
style={{ backgroundColor: '#ec4899' }}>
Browse Other Drops
</button>
</Link>
</div>
)}

{/* Drop info */}
<div className="mb-10 p-6 rounded-3xl"
style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3' }}><br/>
<p className="mb-4" style={{ color: '#6b7280' }}>{drop.description}</p><br/>
<div className="flex gap-8 flex-wrap"><br/>
<div>
<p className="text-xs mb-1" style={{ color: '#9ca3af' }}>Release Date</p>
<p className="font-semibold text-sm" style={{ color: '#1a1a2e' }}>
{new Date(drop.releaseDate).toLocaleString('en-US', {
day: 'numeric', month: 'long', year: 'numeric',
hour: '2-digit', minute: '2-digit'
})}
</p>
</div>
<div>
<p className="text-xs mb-1" style={{ color: '#9ca3af' }}>End Date</p>
<p className="font-semibold text-sm" style={{ color: '#1a1a2e' }}>
{new Date(drop.endDate).toLocaleString('en-US', {
day: 'numeric', month: 'long', year: 'numeric',
hour: '2-digit', minute: '2-digit'
})}
</p>
</div>
<div>
<p className="text-xs mb-1" style={{ color: '#9ca3af' }}>Products</p>
<p className="font-semibold text-sm" style={{ color: '#1a1a2e' }}>{drop.products.length} items</p>
</div>
</div>
</div>
<br/>
{/* Products grid — only show if live */}
{drop.status === 'LIVE' ? (
<>
<h2 className="text-2xl font-bold mb-6 " style={{ color: '#1a1a2e' }}>
Products in this Drop
</h2><br/><br/>

{drop.products.length === 0 ? (
<div className="text-center py-20 rounded-xl"
style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3' }}>
<p className="text-5xl mb-4">👗</p><br/>
<p className="text-lg font-semibold" style={{ color: '#1a1a2e' }}>No products yet</p>
</div>
) : (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
{drop.products.map(product => (
<Link to={`/products/${product.id}`} key={product.id}>
<div className="rounded-3xl overflow-hidden transition-all hover:scale-105 cursor-pointer"
style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3', boxShadow: '0 2px 12px rgba(236,72,153,0.06)' }}>

<div className="relative h-52 overflow-hidden">
<img src={product.imageUrl} alt={product.name}
className="w-full h-full object-cover transition-transform hover:scale-110"
onError={e => e.target.src = '/images/product1.jpg'} />
{product.stock === 0 && (
<div className="absolute inset-0 flex items-center justify-center"
style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
<span className="text-white font-bold text-sm px-3 py-1 rounded-full"
style={{ backgroundColor: '#dc2626' }}>Sold Out</span>
</div>
)}
</div>

<div className="p-4">
<h3 className="font-bold mb-1" style={{ color: '#1a1a2e' }}>{product.name}</h3>
<p className="text-xs mb-3 line-clamp-1" style={{ color: '#9ca3af' }}>
{product.description}
</p>
<div className="flex items-center justify-between">
<span className="font-bold text-lg" style={{ color: '#ec4899' }}>
${product.price}
</span>
<span className="text-xs" style={{ color: '#9ca3af' }}>
{product.stock > 0 ? `${product.stock} left` : 'Sold out'}
</span>
</div>
</div>

</div>
</Link>
))}
</div>
)}
</>
) : drop.status === 'UPCOMING' ? (
<div className="text-center py-16 rounded-3xl"
style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3' }}>
<p className="text-5xl mb-4">🔒</p>
<p className="text-xl font-bold mb-2" style={{ color: '#1a1a2e' }}>
Products revealed when drop goes live
</p>
<p style={{ color: '#9ca3af' }}>
Check back on {new Date(drop.releaseDate).toLocaleDateString('en-US', {
weekday: 'long', day: 'numeric', month: 'long'
})}
</p>
</div>
) : null}

</div>
</div>
)
}

export default DropDetailPage