import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

function MyOrdersPage() {
const { user } = useUser()
const [orders, setOrders] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
if (!user) return
axios.get(`${import.meta.env.VITE_API_URL}/api/orders/my/${user.id}`)
.then(res => setOrders(res.data))
.catch(console.error)
.finally(() => setLoading(false))
}, [user])

const statusColor = (status) => {
if (status === 'DELIVERED') return { bg: '#dcfce7', color: '#16a34a' }
if (status === 'SHIPPED') return { bg: '#dbeafe', color: '#2563eb' }
if (status === 'PROCESSING') return { bg: '#fef9c3', color: '#ca8a04' }
if (status === 'CANCELLED') return { bg: '#fee2e2', color: '#dc2626' }
return { bg: '#fce7f3', color: '#ec4899' }
}

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

<div className="max-w-4xl mx-auto px-6 py-10">

<div className="mb-10">
<h1 className="text-3xl font-bold" style={{ color: '#1a1a2e' }}>My Orders</h1>
<p className="mt-1" style={{ color: '#9ca3af' }}>Track all your purchases</p>
</div>

{orders.length === 0 ? (
<div className="text-center py-24 rounded-3xl"
style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3' }}>
<p className="text-6xl mb-4">📦</p>
<p className="text-xl font-semibold mb-2" style={{ color: '#1a1a2e' }}>No orders yet</p>
<p className="mb-8" style={{ color: '#9ca3af' }}>
You haven't placed any orders yet
</p>
<Link to="/drops">
<button className="px-8 py-3 rounded-2xl text-white font-semibold"
style={{ backgroundColor: '#ec4899' }}>
Browse Drops
</button>
</Link>
</div>
) : (
<div className="flex flex-col gap-6">
{orders.map(order => (
<div key={order.id} className="rounded-3xl overflow-hidden"
style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3', boxShadow: '0 2px 12px rgba(236,72,153,0.06)' }}>

{/* Order header */}
<div className="px-6 py-4 flex items-center justify-between"
style={{ borderBottom: '1px solid #fce7f3', backgroundColor: '#fff5f9' }}>
<div>
<p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>
Order ID
</p>
<p className="font-mono text-sm font-bold" style={{ color: '#1a1a2e' }}>
#{order.id.slice(-8).toUpperCase()}
</p>
</div>

<div className="text-center">
<p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>
Date
</p>
<p className="text-sm font-medium" style={{ color: '#1a1a2e' }}>
{new Date(order.createdAt).toLocaleDateString('en-US', {
day: 'numeric', month: 'short', year: 'numeric'
})}
</p>
</div>

<div className="text-center">
<p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>
Total
</p>
<p className="text-lg font-bold" style={{ color: '#ec4899' }}>
${parseFloat(order.totalAmount).toFixed(2)}
</p>
</div>

<div>
<span className="px-4 py-2 rounded-full text-xs font-bold"
style={{ backgroundColor: statusColor(order.status).bg, color: statusColor(order.status).color }}>
{order.status}
</span>
</div>
</div>

{/* Order items */}
<div className="px-6 py-4">
<div className="flex flex-col gap-3">
{order.items.map(item => (
<div key={item.id} className="flex items-center gap-4">
<div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
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
<span className="font-bold text-sm" style={{ color: '#ec4899' }}>
${(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
</span>
</div>
))}
</div>
</div>

{/* Shipping address */}
{order.shippingAddress && (
<div className="px-6 py-4"
style={{ borderTop: '1px solid #fce7f3' }}>
<p className="text-xs font-semibold uppercase tracking-wider mb-2"
style={{ color: '#9ca3af' }}>
Shipping To
</p>
<p className="text-sm font-medium" style={{ color: '#1a1a2e' }}>
{order.shippingAddress.fullName}
</p>
<p className="text-sm" style={{ color: '#6b7280' }}>
{order.shippingAddress.streetAddress}, {order.shippingAddress.city}, {order.shippingAddress.country} {order.shippingAddress.postalCode}
</p>
</div>
)}

{/* Payment status */}
<div className="px-6 py-4 flex items-center justify-between"
style={{ borderTop: '1px solid #fce7f3', backgroundColor: '#fff5f9' }}>
<div className="flex items-center gap-2">
<span className="text-green-500 text-sm">✓</span>
<span className="text-sm font-medium" style={{ color: '#16a34a' }}>
Payment {order.paymentStatus}
</span>
</div>
<span className="text-xs" style={{ color: '#9ca3af' }}>
via Stripe
</span>
</div>

</div>
))}
</div>
)}

</div>
</div>
)
}

export default MyOrdersPage