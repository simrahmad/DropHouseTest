
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../../components/Navbar'

function ManageDrop() {
const { dropId } = useParams()
const navigate = useNavigate()
const [drop, setDrop] = useState(null)
const [products, setProducts] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
const fetchData = async () => {
try {
const productsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/drop/${dropId}`)
setProducts(productsRes.data)

const dropsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/drops`)
const found = dropsRes.data.find(d => d.id === dropId)
setDrop(found)
} catch (err) {
console.error(err)
} finally {
setLoading(false)
}
}
fetchData()
}, [dropId])

const handleDeleteProduct = async (productId) => {
if (!window.confirm('Delete this product?')) return
try {
await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${productId}`)
setProducts(products.filter(p => p.id !== productId))
} catch (err) {
console.error(err)
}
}

const handleDeleteDrop = async () => {
if (!window.confirm('Delete this entire drop and all its products?')) return
try {
await axios.delete(`${import.meta.env.VITE_API_URL}/api/drops/${dropId}`)
navigate('/seller/dashboard')
} catch (err) {
console.error(err)
}
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

<div className="max-w-5xl mx-auto px-6 py-10">

{/* Header */}
<div className="flex items-center justify-between mb-8">
<div>
<button onClick={() => navigate('/seller/dashboard')}
className="text-sm mb-2 flex items-center gap-1 transition-all hover:opacity-70"
style={{ color: '#ec4899' }}>
← Back to Dashboard
</button>
<h1 className="text-3xl font-bold" style={{ color: '#1a1a2e' }}>
{drop?.title || 'Manage Drop'}
</h1>
<p className="mt-1" style={{ color: '#9ca3af' }}>
{products.length} product{products.length !== 1 ? 's' : ''} in this drop
</p>
</div>

<div className="flex gap-3">
<button onClick={() => navigate(`/seller/add-product/${dropId}`)}
className="px-5 py-3 rounded-2xl text-white font-semibold transition-all hover:opacity-90"
style={{ backgroundColor: '#ec4899' }}>
+ Add Product
</button>
<button onClick={handleDeleteDrop}
className="px-5 py-3 rounded-2xl font-semibold transition-all hover:opacity-90"
style={{ backgroundColor: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3' }}>
Delete Drop
</button>
</div>
</div>

{/* Drop cover */}
{drop?.coverImage && (
<div className="w-full h-52 rounded-2xl overflow-hidden mb-8">
<img src={drop.coverImage} alt={drop.title}
className="w-full h-full object-cover"
onError={e => e.target.src = '/images/drop-placeholder.jpg'} />
</div>
)}

{/* Products list */}
{products.length === 0 ? (
<div className="text-center py-20 rounded-2xl"
style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3' }}>
<p className="text-5xl mb-4">👗</p>
<p className="text-lg font-semibold mb-1" style={{ color: '#1a1a2e' }}>No products yet</p>
<p className="mb-6" style={{ color: '#9ca3af' }}>Add your first product to this drop</p>
<button onClick={() => navigate(`/seller/add-product/${dropId}`)}
className="px-6 py-3 rounded-2xl text-white font-semibold"
style={{ backgroundColor: '#ec4899' }}>
Add First Product
</button>
</div>
) : (
<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
{products.map(product => (
<div key={product.id} className="rounded-2xl overflow-hidden"
style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3', boxShadow: '0 2px 12px rgba(236,72,153,0.06)' }}>

<div className="h-48 overflow-hidden relative">
<img src={product.imageUrl} alt={product.name}
className="w-full h-full object-cover"
onError={e => e.target.src = '/images/product-placeholder.jpg'} />
<div className="absolute top-3 left-3">
<span className="px-3 py-1 rounded-full text-xs font-semibold"
style={{ backgroundColor: product.stock > 0 ? '#dcfce7' : '#fee2e2',
color: product.stock > 0 ? '#16a34a' : '#dc2626' }}>
{product.stock > 0 ? `${product.stock} in stock` : 'Sold Out'}
</span>
</div>
</div>

<div className="p-5">
<div className="flex items-start justify-between mb-2">
<h3 className="font-bold text-lg" style={{ color: '#1a1a2e' }}>{product.name}</h3>
<span className="font-bold text-lg" style={{ color: '#ec4899' }}>${product.price}</span>
</div>

<p className="text-sm mb-3 line-clamp-2" style={{ color: '#9ca3af' }}>
{product.description}
</p>

{product.variants?.length > 0 && (
<div className="flex flex-wrap gap-1 mb-3">
{product.variants.map((v, i) => (
<span key={i} className="px-2 py-1 rounded-lg text-xs"
style={{ backgroundColor: '#fce7f3', color: '#ec4899' }}>
{v.size} {v.color}
</span>
))}
</div>
)}

<div className="flex items-center justify-between pt-3"
style={{ borderTop: '1px solid #fce7f3' }}>
<span className="text-xs" style={{ color: '#9ca3af' }}>
{product.category || 'Uncategorized'}
</span>
<button onClick={() => handleDeleteProduct(product.id)}
className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
style={{ backgroundColor: '#fff1f2', color: '#e11d48' }}>
Delete
</button>
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

export default ManageDrop