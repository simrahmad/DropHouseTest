import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

function CheckoutPage() {
const { user } = useUser()
const navigate = useNavigate()
const [cart, setCart] = useState(null)
const [loading, setLoading] = useState(true)
const [paying, setPaying] = useState(false)
const [error, setError] = useState('')

const [form, setForm] = useState({
fullName: '',
phoneNumber: '',
streetAddress: '',
city: '',
country: '',
postalCode: ''
})

useEffect(() => {
if (!user) return
axios.get(`${import.meta.env.VITE_API_URL}/api/cart/${user.id}`)
.then(res => {
if (!res.data || res.data.items.length === 0) {
navigate('/cart')
}
setCart(res.data)
})
.catch(console.error)
.finally(() => setLoading(false))
}, [user])

const handleChange = e => {
setForm({ ...form, [e.target.name]: e.target.value })
}

const handleSubmit = async e => {
e.preventDefault()
setError('')
setPaying(true)

try {
const items = cart.items.map(item => ({
productId: item.product.id,
name: item.product.name,
price: item.product.price,
imageUrl: item.product.imageUrl,
quantity: item.quantity
}))

const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/create-checkout-session`, {
clerkId: user.id,
items,
shippingAddress: form
})

window.location.href = res.data.url
} catch (err) {
setError(err.response?.data?.message || 'Payment failed. Please try again.')
setPaying(false)
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

<h1 className="text-3xl font-bold mb-8" style={{ color: '#1a1a2e' }}>Checkout</h1>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

{/* Shipping form */}
<div className="rounded-3xl p-8"
style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3', boxShadow: '0 4px 24px rgba(236,72,153,0.07)' }}>

<h2 className="text-xl font-bold mb-6" style={{ color: '#1a1a2e' }}>Shipping Details</h2>

<form onSubmit={handleSubmit} className="flex flex-col gap-4">

{[
{ name: 'fullName', label: 'Full Name', placeholder: 'John Doe' },
{ name: 'phoneNumber', label: 'Phone Number', placeholder: '+1 234 567 8900' },
{ name: 'streetAddress', label: 'Street Address', placeholder: '123 Main Street' },
{ name: 'city', label: 'City', placeholder: 'New York' },
{ name: 'country', label: 'Country', placeholder: 'United States' },
{ name: 'postalCode', label: 'Postal Code', placeholder: '10001' },
].map(field => (
<div key={field.name} className="flex flex-col gap-1">
<label className="text-sm font-medium" style={{ color: '#374151' }}>
{field.label}
</label>
<input
name={field.name}
value={form[field.name]}
onChange={handleChange}
placeholder={field.placeholder}
required
className="px-4 py-3 rounded-xl text-sm transition-all"
style={{ border: '1px solid #fce7f3', backgroundColor: '#fff5f9', color: '#1a1a2e' }}
/>
</div>
))}

{error && (
<div className="px-4 py-3 rounded-xl text-sm"
style={{ backgroundColor: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3' }}>
{error}
</div>
)}

<button type="submit" disabled={paying}
className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all hover:opacity-90 hover:scale-105 disabled:opacity-60 disabled:scale-100 mt-2"
style={{ backgroundColor: '#ec4899', boxShadow: '0 8px 30px rgba(236,72,153,0.3)' }}>
{paying ? 'Redirecting to Stripe...' : `Pay $${total.toFixed(2)} →`}
</button>

</form>
</div>

{/* Order summary */}
<div className="rounded-3xl p-6 h-fit"
style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3', boxShadow: '0 4px 24px rgba(236,72,153,0.07)' }}>

<h2 className="text-xl font-bold mb-6" style={{ color: '#1a1a2e' }}>Order Summary</h2>

<div className="flex flex-col gap-4 mb-6">
{cart?.items?.map(item => (
<div key={item.id} className="flex gap-3 items-center">
<div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
<img src={item.product.imageUrl} alt={item.product.name}
className="w-full h-full object-cover"
onError={e => e.target.src = '/images/product1.jpg'} />
</div>
<div className="flex-1">
<p className="font-medium text-sm" style={{ color: '#1a1a2e' }}>{item.product.name}</p>
<p className="text-xs" style={{ color: '#9ca3af' }}>Qty: {item.quantity}</p>
</div>
<span className="font-bold text-sm" style={{ color: '#ec4899' }}>
${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
</span>
</div>
))}
</div>

<div className="h-px mb-4" style={{ backgroundColor: '#fce7f3' }} />

<div className="flex justify-between font-bold text-lg">
<span style={{ color: '#1a1a2e' }}>Total</span>
<span style={{ color: '#ec4899' }}>${total.toFixed(2)}</span>
</div>

<div className="mt-6 p-4 rounded-2xl text-sm text-center"
style={{ backgroundColor: '#fce7f3', color: '#ec4899' }}>
🔒 Secure payment powered by Stripe
</div>

</div>

</div>
</div>
</div>
)
}

export default CheckoutPage