import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

function OrderSuccessPage() {
const [searchParams] = useSearchParams()
const sessionId = searchParams.get('session_id')
const [order, setOrder] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
if (!sessionId) return
axios.get(`${import.meta.env.VITE_API_URL}/api/payments/verify-session/${sessionId}`)
.then(res => {
if (res.data.success) setOrder(res.data.order)
})
.catch(console.error)
.finally(() => setLoading(false))
}, [sessionId])

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

<div className="max-w-2xl mx-auto px-6 py-16 text-center">

<div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
style={{ backgroundColor: '#dcfce7' }}>
<span className="text-4xl">✓</span>
</div>

<h1 className="text-4xl font-bold mb-2" style={{ color: '#1a1a2e' }}>Order Confirmed!</h1>
<p className="mb-10" style={{ color: '#9ca3af' }}>
Thank you for your purchase. Your order is on its way.
</p>

{order && (
<div className="rounded-3xl p-6 text-left mb-8"
style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3' }}>

<h2 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Order Details</h2>

{order.items.map(item => (
<div key={item.id} className="flex gap-3 items-center mb-3">
<div className="w-12 h-12 rounded-xl overflow-hidden">
<img src={item.product.imageUrl} alt={item.product.name}
className="w-full h-full object-cover"
onError={e => e.target.src = '/images/product1.jpg'} />
</div>
<div className="flex-1">
<p className="font-medium text-sm" style={{ color: '#1a1a2e' }}>{item.product.name}</p>
<p className="text-xs" style={{ color: '#9ca3af' }}>Qty: {item.quantity}</p>
</div>
<span className="font-bold text-sm" style={{ color: '#ec4899' }}>
${(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
</span>
</div>
))}

<div className="h-px my-4" style={{ backgroundColor: '#fce7f3' }} />

<div className="flex justify-between font-bold">
<span style={{ color: '#1a1a2e' }}>Total Paid</span>
<span style={{ color: '#ec4899' }}>${parseFloat(order.totalAmount).toFixed(2)}</span>
</div>

{order.shippingAddress && (
<div className="mt-4 p-4 rounded-2xl" style={{ backgroundColor: '#fff5f9' }}>
<p className="text-xs font-semibold mb-1" style={{ color: '#9ca3af' }}>SHIPPING TO</p>
<p className="text-sm font-medium" style={{ color: '#1a1a2e' }}>
{order.shippingAddress.fullName}
</p>
<p className="text-sm" style={{ color: '#6b7280' }}>
{order.shippingAddress.streetAddress}, {order.shippingAddress.city}, {order.shippingAddress.country}
</p>
</div>
)}

</div>
)}

<div className="flex gap-4 justify-center">
<Link to="/my-orders">
<button className="px-8 py-3 rounded-2xl text-white font-semibold transition-all hover:opacity-90"
style={{ backgroundColor: '#ec4899' }}>
View My Orders
</button>
</Link>
<Link to="/">
<button className="px-8 py-3 rounded-2xl font-semibold transition-all hover:opacity-80"
style={{ backgroundColor: '#fce7f3', color: '#ec4899' }}>
Continue Shopping
</button>
</Link>
</div>

</div>
</div>
)
}

export default OrderSuccessPage