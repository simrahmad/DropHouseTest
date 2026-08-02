import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../../components/Navbar'

function AddProduct() {
const { dropId } = useParams()
const navigate = useNavigate()
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')

const [form, setForm] = useState({
name: '',
description: '',
price: '',
stock: '',
imageUrl: '',
category: '',
sku: ''
})

const [variants, setVariants] = useState([])
const [newVariant, setNewVariant] = useState({ size: '', color: '', stock: '' })

const handleChange = e => {
setForm({ ...form, [e.target.name]: e.target.value })
}

const addVariant = () => {
if (!newVariant.size && !newVariant.color) return
setVariants([...variants, newVariant])
setNewVariant({ size: '', color: '', stock: '' })
}

const removeVariant = i => {
setVariants(variants.filter((_, idx) => idx !== i))
}

const handleSubmit = async e => {
e.preventDefault()
setError('')
setLoading(true)

try {
await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, {
...form,
dropId,
variants
})
navigate('/seller/dashboard')
} catch (err) {
setError(err.response?.data?.message || 'Something went wrong')
} finally {
setLoading(false)
}
}

return (
<div style={{ backgroundColor: '#fff5f9', minHeight: '100vh' }}>
<Navbar />

<div className="max-w-2xl mx-auto px-6 py-10">

<div className="mb-8">
<h1 className="text-3xl font-bold" style={{ color: '#1a1a2e' }}>Add Product</h1>
<p className="mt-1" style={{ color: '#9ca3af' }}>Add a product to your drop</p>
</div>

<div className="rounded-3xl p-8" style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3', boxShadow: '0 4px 24px rgba(236,72,153,0.07)' }}>
<form onSubmit={handleSubmit} className="flex flex-col gap-6">

{/* Image preview */}
{form.imageUrl && (
<div className="w-full h-48 rounded-2xl overflow-hidden">
<img src={form.imageUrl} alt="Product preview" className="w-full h-full object-cover"
onError={e => e.target.src = '/images/product-placeholder.jpg'} />
</div>
)}

<div className="flex flex-col gap-1">
<label className="text-sm font-medium" style={{ color: '#374151' }}>Product Name</label>
<input name="name" value={form.name} onChange={handleChange}
placeholder="e.g. Oversized Pink Hoodie" required
className="px-4 py-3 rounded-xl text-sm"
style={{ border: '1px solid #fce7f3', backgroundColor: '#fff5f9', color: '#1a1a2e' }} />
</div>

<div className="flex flex-col gap-1">
<label className="text-sm font-medium" style={{ color: '#374151' }}>Description</label>
<textarea name="description" value={form.description} onChange={handleChange}
placeholder="Describe your product..." rows={3}
className="px-4 py-3 rounded-xl text-sm resize-none"
style={{ border: '1px solid #fce7f3', backgroundColor: '#fff5f9', color: '#1a1a2e' }} />
</div>

<div className="grid grid-cols-2 gap-4">
<div className="flex flex-col gap-1">
<label className="text-sm font-medium" style={{ color: '#374151' }}>Price ($)</label>
<input name="price" value={form.price} onChange={handleChange}
type="number" placeholder="59.99" required
className="px-4 py-3 rounded-xl text-sm"
style={{ border: '1px solid #fce7f3', backgroundColor: '#fff5f9', color: '#1a1a2e' }} />
</div>
<div className="flex flex-col gap-1">
<label className="text-sm font-medium" style={{ color: '#374151' }}>Stock</label>
<input name="stock" value={form.stock} onChange={handleChange}
type="number" placeholder="50" required
className="px-4 py-3 rounded-xl text-sm"
style={{ border: '1px solid #fce7f3', backgroundColor: '#fff5f9', color: '#1a1a2e' }} />
</div>
</div>

<div className="flex flex-col gap-1">
<label className="text-sm font-medium" style={{ color: '#374151' }}>Product Image URL</label>
<input name="imageUrl" value={form.imageUrl} onChange={handleChange}
placeholder="Right click image on Google → Copy image address → paste here"
className="px-4 py-3 rounded-xl text-sm"
style={{ border: '1px solid #fce7f3', backgroundColor: '#fff5f9', color: '#1a1a2e' }} />
</div>

<div className="grid grid-cols-2 gap-4">
<div className="flex flex-col gap-1">
<label className="text-sm font-medium" style={{ color: '#374151' }}>Category</label>
<input name="category" value={form.category} onChange={handleChange}
placeholder="e.g. Hoodie, Tee, Pants"
className="px-4 py-3 rounded-xl text-sm"
style={{ border: '1px solid #fce7f3', backgroundColor: '#fff5f9', color: '#1a1a2e' }} />
</div>
<div className="flex flex-col gap-1">
<label className="text-sm font-medium" style={{ color: '#374151' }}>SKU (optional)</label>
<input name="sku" value={form.sku} onChange={handleChange}
placeholder="e.g. DH-001"
className="px-4 py-3 rounded-xl text-sm"
style={{ border: '1px solid #fce7f3', backgroundColor: '#fff5f9', color: '#1a1a2e' }} />
</div>
</div>

{/* Variants */}
<div>
<label className="text-sm font-medium mb-2 block" style={{ color: '#374151' }}>
Variants (sizes / colors)
</label>

{variants.length > 0 && (
<div className="flex flex-wrap gap-2 mb-3">
{variants.map((v, i) => (
<div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
style={{ backgroundColor: '#fce7f3', color: '#ec4899' }}>
<span>{v.size} {v.color} — {v.stock} pcs</span>
<button type="button" onClick={() => removeVariant(i)} className="font-bold">×</button>
</div>
))}
</div>
)}

<div className="grid grid-cols-3 gap-2">
<input value={newVariant.size} onChange={e => setNewVariant({ ...newVariant, size: e.target.value })}
placeholder="Size (S, M, L)"
className="px-3 py-2 rounded-xl text-sm"
style={{ border: '1px solid #fce7f3', backgroundColor: '#fff5f9' }} />
<input value={newVariant.color} onChange={e => setNewVariant({ ...newVariant, color: e.target.value })}
placeholder="Color"
className="px-3 py-2 rounded-xl text-sm"
style={{ border: '1px solid #fce7f3', backgroundColor: '#fff5f9' }} />
<input value={newVariant.stock} onChange={e => setNewVariant({ ...newVariant, stock: e.target.value })}
placeholder="Stock" type="number"
className="px-3 py-2 rounded-xl text-sm"
style={{ border: '1px solid #fce7f3', backgroundColor: '#fff5f9' }} />
</div>
<button type="button" onClick={addVariant}
className="mt-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
style={{ backgroundColor: '#fce7f3', color: '#ec4899' }}>
+ Add Variant
</button>
</div>

{error && (
<div className="px-4 py-3 rounded-xl text-sm"
style={{ backgroundColor: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3' }}>
{error}
</div>
)}

<button type="submit" disabled={loading}
className="w-full py-4 rounded-2xl text-white font-semibold text-base transition-all hover:opacity-90 hover:scale-105 disabled:opacity-60"
style={{ backgroundColor: '#ec4899' }}>
{loading ? 'Adding Product...' : 'Add Product 👗'}
</button>

</form>
</div>
</div>
</div>
)
}

export default AddProduct