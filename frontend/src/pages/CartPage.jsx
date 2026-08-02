import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

function CartPage() {
const { user } = useUser()
const navigate = useNavigate()
const [cart, setCart] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
if (!user) return
fetchCart()
}, [user])

const fetchCart = async () => {
try {
const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart/${user.id}`)
setCart(res.data)
} catch (err) {
console.error(err)
} finally {
setLoading(false)
}
}

const updateQuantity = async (itemId, quantity) => {
try {
await axios.put(`${import.meta.env.VITE_API_URL}/api/cart/item/${itemId}`, { quantity })
fetchCart()
} catch (err) {
console.error(err)
}
}

const removeItem = async (itemId) => {
try {
await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/item/${itemId}`)
fetchCart()
} catch (err) {
console.error(err)
}
}

const total = cart?.items?.reduce((acc, item) => acc + parseFloat(item.product.price) * item.quantity, 0) || 0

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

<div className="max-w-5xl mx-auto px-6 py-10">

<h1 className="text-3xl font-bold mb-8" style={{ color: '#1a1a2e' }}>Your Cart</h1>

{!cart || cart.items.length === 0 ? (
<div className="text-center py-24 rounded-3xl"
style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3' }}>
<p className="text-6xl mb-4">🛒</p>
<p className="text-xl font-semibold mb-2" style={{ color: '#1a1a2e' }}>Your cart is empty</p>
<p className="mb-8" style={{ color: '#9ca3af' }}>Browse drops and add something you love</p>
<Link to="/drops">
<button className="px-8 py-3 rounded-2xl text-white font-semibold"
style={{ backgroundColor: '#ec4899' }}>
Browse Drops
</button>
</Link>
</div>
) : (
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

{/* Cart items */}
<div className="lg:col-span-2 flex flex-col gap-4">
{cart.items.map(item => (
<div key={item.id} className="flex gap-4 p-4 rounded-2xl"
style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3' }}>

<div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
<img src={item.product.imageUrl} alt={item.product.name}
className="w-full h-full object-cover"
onError={e => e.target.src = '/images/product1.jpg'} />
</div>

<div className="flex-1">
<h3 className="font-bold mb-1" style={{ color: '#1a1a2e' }}>{item.product.name}</h3>
<p className="text-sm mb-3" style={{ color: '#9ca3af' }}>{item.product.category}</p>

<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<button onClick={() => updateQuantity(item.id, item.quantity - 1)}
className="w-8 h-8 rounded-lg font-bold transition-all hover:opacity-80"
style={{ backgroundColor: '#fce7f3', color: '#ec4899' }}>
−
</button>
<span className="font-semibold w-6 text-center" style={{ color: '#1a1a2e' }}>
{item.quantity}
</span>
<button onClick={() => updateQuantity(item.id, item.quantity + 1)}
className="w-8 h-8 rounded-lg font-bold transition-all hover:opacity-80"
style={{ backgroundColor: '#fce7f3', color: '#ec4899' }}>
+
</button>
</div>

<div className="flex items-center gap-4">
<span className="font-bold" style={{ color: '#ec4899' }}>
${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
</span>
<button onClick={() => removeItem(item.id)}
className="text-sm transition-all hover:opacity-70"
style={{ color: '#9ca3af' }}>
Remove
</button>
</div>
</div>
</div>

</div>
))}
</div>

{/* Order summary */}
<div className="lg:col-span-1">
<div className="rounded-3xl p-6 sticky top-6"
style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3', boxShadow: '0 4px 24px rgba(236,72,153,0.07)' }}>

<h2 className="text-xl font-bold mb-6" style={{ color: '#1a1a2e' }}>Order Summary</h2>

<div className="flex flex-col gap-3 mb-6">
<div className="flex justify-between text-sm" style={{ color: '#6b7280' }}>
<span>Subtotal</span>
<span>${total.toFixed(2)}</span>
</div>
<div className="flex justify-between text-sm" style={{ color: '#6b7280' }}>
<span>Shipping</span>
<span className="text-green-500 font-medium">Free</span>
</div>
<div className="h-px" style={{ backgroundColor: '#fce7f3' }} />
<div className="flex justify-between font-bold text-lg">
<span style={{ color: '#1a1a2e' }}>Total</span>
<span style={{ color: '#ec4899' }}>${total.toFixed(2)}</span>
</div>
</div>

<button onClick={() => navigate('/checkout')}
className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all hover:opacity-90 hover:scale-105"
style={{ backgroundColor: '#ec4899', boxShadow: '0 8px 30px rgba(236,72,153,0.3)' }}>
Proceed to Checkout →
</button>

<Link to="/drops">
<button className="w-full py-3 rounded-2xl text-sm font-medium mt-3 transition-all hover:opacity-80"
style={{ backgroundColor: '#fce7f3', color: '#ec4899' }}>
Continue Shopping
</button>
</Link>

</div>
</div>

</div>
)}
</div>
</div>
)
}

export default CartPage