import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

function ProductsPage() {
const [products, setProducts] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
axios.get(`${import.meta.env.VITE_API_URL}/api/products`)
.then(res => setProducts(res.data))
.catch(console.error)
.finally(() => setLoading(false))
}, [])

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
<h1 className="text-4xl font-bold" style={{ color: '#1a1a2e' }}>All Products</h1>
<p className="mt-2" style={{ color: '#9ca3af' }}>
{products.length} products available
</p>
</div>

{products.length === 0 ? (
<div className="text-center py-20 rounded-3xl"
style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3' }}>
<p className="text-5xl mb-4">👗</p>
<p className="text-xl font-semibold mb-2" style={{ color: '#1a1a2e' }}>No products yet</p>
<p style={{ color: '#9ca3af' }}>Check back soon</p>
</div>
) : (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
{products.map(product => (
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
<div className="absolute top-3 right-3">
<span className="text-xs px-2 py-1 rounded-full font-medium"
style={{ backgroundColor: 'rgba(255,245,249,0.9)', color: '#ec4899' }}>
{product.category || 'Fashion'}
</span>
</div>
</div>

<div className="p-4">
<h3 className="font-bold mb-1" style={{ color: '#1a1a2e' }}>{product.name}</h3>
<p className="text-xs mb-3 line-clamp-1" style={{ color: '#9ca3af' }}>
{product.description}
</p>
{product.drop && (
<p className="text-xs mb-2 px-2 py-1 rounded-lg w-fit"
style={{ backgroundColor: '#fce7f3', color: '#ec4899' }}>
🎁 {product.drop.title}
</p>
)}
<div className="flex items-center justify-between">
<span className="font-bold text-lg" style={{ color: '#ec4899' }}>
${parseFloat(product.price).toFixed(2)}
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
</div>
</div>
)
}

export default ProductsPage