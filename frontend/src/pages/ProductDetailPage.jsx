import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useUser } from '@clerk/clerk-react'

function ProductDetailPage() {
const { id } = useParams()
const navigate = useNavigate()
const { user } = useUser()
const [product, setProduct] = useState(null)
const [loading, setLoading] = useState(true)
const [selectedVariant, setSelectedVariant] = useState(null)
const [quantity, setQuantity] = useState(1)
const [added, setAdded] = useState(false)

useEffect(() => {
axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
.then(res => setProduct(res.data))
.catch(console.error)
.finally(() => setLoading(false))
}, [id])

const handleAddToCart = async () => {
try {
await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/add`, {
clerkId: user.id,
productId: product.id,
quantity
})
setAdded(true)
setTimeout(() => setAdded(false), 2000)
} catch (err) {
console.error('Failed to add to cart', err)
}
}


if (loading) {
return (
<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fff5f9' }}>
<div className="w-10 h-10 rounded-full border-4 border-pink-300 border-t-pink-500 animate-spin" />
</div>
)
}

if (!product) {
return (
<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fff5f9' }}>
<p style={{ color: '#9ca3af' }}>Product not found</p>
</div>
)
}

return (
<div style={{ backgroundColor: '#fff5f9', minHeight: '100vh' }}>
<Navbar />

<div className="max-w-5xl mx-auto px-6 py-10">

{/* Back button */}
<button onClick={() => navigate(-1)}
className="flex items-center gap-2 text-sm mb-8 transition-all hover:opacity-70"
style={{ color: '#ec4899' }}>
← Back
</button>

<div className="grid grid-cols-1 md:grid-cols-2 gap-10">

{/* Image */}
<div className="rounded-3xl overflow-hidden" style={{ height: '480px' }}>
<img src={product.imageUrl} alt={product.name}
className="w-full h-full object-cover"
onError={e => e.target.src = '/images/product1.jpg'} />
</div>

{/* Details */}
<div className="flex flex-col justify-between">
<div>

<div className="flex items-center gap-2 mb-3">
<span className="text-xs px-3 py-1 rounded-full font-medium"
style={{ backgroundColor: '#fce7f3', color: '#ec4899' }}>
{product.category || 'Fashion'}
</span>
{product.stock === 0 && (
<span className="text-xs px-3 py-1 rounded-full font-medium"
style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
Sold Out
</span>
)}
</div>

<h1 className="text-3xl font-bold mb-2" style={{ color: '#1a1a2e' }}>{product.name}</h1>
<p className="text-4xl font-bold mb-4" style={{ color: '#ec4899' }}>${product.price}</p>
<p className="mb-6 leading-relaxed" style={{ color: '#6b7280' }}>{product.description}</p>

{/* From drop */}
{product.drop && (
<div className="mb-6 px-4 py-3 rounded-2xl flex items-center gap-3"
style={{ backgroundColor: '#fce7f3' }}>
<span className="text-pink-400">🎁</span>
<div>
<p className="text-xs" style={{ color: '#9ca3af' }}>Part of drop</p>
<p className="font-semibold text-sm" style={{ color: '#ec4899' }}>{product.drop.title}</p>
</div>
</div>
)}

{/* Variants */}
{product.variants?.length > 0 && (
<div className="mb-6">
<p className="text-sm font-semibold mb-3" style={{ color: '#374151' }}>Select Size / Color</p>
<div className="flex flex-wrap gap-2">
{product.variants.map(v => (
<button key={v.id}
onClick={() => setSelectedVariant(v)}
className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
style={{
backgroundColor: selectedVariant?.id === v.id ? '#ec4899' : '#ffffff',
color: selectedVariant?.id === v.id ? '#ffffff' : '#6b7280',
border: '1px solid',
borderColor: selectedVariant?.id === v.id ? '#ec4899' : '#fce7f3'
}}>
{v.size} {v.color}
</button>
))}
</div>
</div>
)}

{/* Quantity */}
<div className="mb-6">
<p className="text-sm font-semibold mb-3" style={{ color: '#374151' }}>Quantity</p>
<div className="flex items-center gap-3">
<button onClick={() => setQuantity(Math.max(1, quantity - 1))}
className="w-10 h-10 rounded-xl font-bold text-lg transition-all hover:opacity-80"
style={{ backgroundColor: '#fce7f3', color: '#ec4899' }}>
−
</button>
<span className="text-lg font-bold w-8 text-center" style={{ color: '#1a1a2e' }}>
{quantity}
</span>
<button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
className="w-10 h-10 rounded-xl font-bold text-lg transition-all hover:opacity-80"
style={{ backgroundColor: '#fce7f3', color: '#ec4899' }}>
+
</button>
<span className="text-sm ml-2" style={{ color: '#9ca3af' }}>
{product.stock} available
</span>
</div>
</div>

</div>

{/* Add to cart button */}
<button
onClick={handleAddToCart}
disabled={product.stock === 0}
className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all hover:opacity-90 hover:scale-105 disabled:opacity-50 disabled:scale-100"
style={{ backgroundColor: added ? '#16a34a' : '#ec4899', boxShadow: '0 8px 30px rgba(236,72,153,0.3)' }}>
{added ? '✓ Added to Cart!' : product.stock === 0 ? 'Sold Out' : 'Add to Cart 🛒'}
</button>

</div>
</div>
</div>
</div>
)
}

export default ProductDetailPage