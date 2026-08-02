import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'
import Navbar from '../../components/Navbar'

function SellerOrders() {
const { user } = useUser()
const [orders, setOrders] = useState([])
const [loading, setLoading] = useState(true)
const [updating, setUpdating] = useState(null)

useEffect(() => {
if (!user) return
axios.get(`${import.meta.env.VITE_API_URL}/api/orders/seller/${user.id}`)
.then(res => setOrders(res.data))
.catch(console.error)
.finally(() => setLoading(false))
}, [user])

const updateStatus = async (orderId, status) => {
setUpdating(orderId)
try {
await axios.put(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`, { status })
setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o))
} catch (err) {
console.error(err)
} finally {
setUpdating(null)
}
}

const statusColor = (status) => {
if (status === 'DELIVERED') return { bg: '#dcfce7', color: '#16a34a' }
if (status === 'SHIPPED') return { bg: '#dbeafe', color: '#2563eb' }
if (status === 'PROCESSING') return { bg: '#fef9c3', color: '#ca8a04' }
if (status === 'CANCELLED') return { bg: '#fee2e2', color: '#dc2626' }
return { bg: '#fce7f3', color: '#ec4899' }
}

const totalRevenue = orders.reduce((acc, o) => acc + parseFloat(o.totalAmount), 0)

if (loading) {
return (
<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fff5f9' }}>
<div className="w-10 h-10 rounded-full border-4 border-pink-300 border-t-pink-500 animate-spin" />
</div>
)
}

return (
<div style={{ backgroundColor: '#fff5f9', minHeight: '100vh' }}>
<Navbar />

<div className="max-w-6xl mx-auto px-6 py-10">

<div className="mb-10">
<h1 className="text-3xl font-bold" style={{ color: '#1a1a2e' }}>Orders Received</h1>
<p className="mt-1" style={{ color: '#9ca3af' }}>Manage and update your customer orders</p>
</div>

{/* Stats */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
{[
{ label: 'Total Orders', value: orders.length, icon: '📦' },
{ label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: '💰' },
{ label: 'Pending', value: orders.filter(o => o.status === 'PENDING').length, icon: '⏳' }
].map((stat, i) => (
<div key={i} className="rounded-2xl p-6 flex items-center gap-5"
style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3', boxShadow: '0 2px 12px rgba(236,72,153,0.06)' }}>
<div className="text-4xl">{stat.icon}</div>
<div>
<p className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>{stat.value}</p>
<p className="text-sm" style={{ color: '#9ca3af' }}>{stat.label}</p>
</div>
</div>
))}
</div>

{/* Orders list */}
{orders.length === 0 ? (
<div className="text-center py-24 rounded-3xl"
style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3' }}>
<p className="text-6xl mb-4">📭</p>
<p className="text-xl font-semibold mb-2" style={{ color: '#1a1a2e' }}>No orders yet</p>
<p style={{ color: '#9ca3af' }}>Orders will appear here once customers start buying</p>
</div>
) : (
<div className="flex flex-col gap-6">
{orders.map(order => (
<div key={order.id} className="rounded-3xl overflow-hidden"
style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3', boxShadow: '0 2px 12px rgba(236,72,153,0.06)' }}>

{/* Order header */}
<div className="px-6 py-4 flex items-center justify-between flex-wrap gap-4"
style={{ borderBottom: '1px solid #fce7f3', backgroundColor: '#fff5f9' }}>

<div>
<p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>
Order ID
</p>
<p className="font-mono text-sm font-bold" style={{ color: '#1a1a2e' }}>
#{order.id.slice(-8).toUpperCase()}
</p>
</div>

<div>
<p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>
Customer
</p>
<p className="text-sm font-medium" style={{ color: '#1a1a2e' }}>
{order.user?.firstName} {order.user?.lastName}
</p>
<p className="text-xs" style={{ color: '#9ca3af' }}>{order.user?.email}</p>
</div>

<div>
<p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>
Date
</p>
<p className="text-sm" style={{ color: '#1a1a2e' }}>
{new Date(order.createdAt).toLocaleDateString('en-US', {
day: 'numeric', month: 'short', year: 'numeric'
})}
</p>
</div>

<div>
<p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>
Total
</p>
<p className="text-lg font-bold" style={{ color: '#ec4899' }}>
${parseFloat(order.totalAmount).toFixed(2)}
</p>
</div>

<span className="px-4 py-2 rounded-full text-xs font-bold"
style={{ backgroundColor: statusColor(order.status).bg, color: statusColor(order.status).color }}>
{order.status}
</span>
</div>

{/* Order items */}
<div className="px-6 py-4">
<div className="flex flex-col gap-3 mb-4">
{order.items.map(item => (
<div key={item.id} className="flex items-center gap-4">
<div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
<img src={item.product.imageUrl} alt={item.product.name}
className="w-full h-full object-cover"
onError={e => e.target.src = '/images/product1.jpg'} />
</div>
<div className="flex-1">
<p className="font-semibold text-sm" style={{ color: '#1a1a2e' }}>
{item.product.name}
</p>
<p className="text-xs" style={{ color: '#9ca3af' }}>
Qty: {item.quantity} × ${parseFloat(item.unitPrice).toFixed(2)}
</p>
</div>
</div>
))}
</div>

{/* Update status */}
<div className="flex items-center gap-3 flex-wrap">
<p className="text-sm font-medium" style={{ color: '#374151' }}>Update Status:</p>
{['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(status => (
<button key={status}
onClick={() => updateStatus(order.id, status)}
disabled={order.status === status || updating === order.id}
className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80 disabled:opacity-40"
style={{
backgroundColor: order.status === status ? statusColor(status).bg : '#f9fafb',
color: order.status === status ? statusColor(status).color : '#6b7280',
border: '1px solid',
borderColor: order.status === status ? statusColor(status).color : '#e5e7eb'
}}>
{updating === order.id ? '...' : status}
</button>
))}
</div>
</div>

</div>
))}
</div>
)}

</div>
</div>
)
}

export default SellerOrders