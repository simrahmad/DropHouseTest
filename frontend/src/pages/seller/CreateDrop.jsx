import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../../components/Navbar'

function CreateDrop() {
const { user } = useUser()
const navigate = useNavigate()
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')

const [form, setForm] = useState({
title: '',
description: '',
coverImage: '',
releaseDate: '',
status: 'UPCOMING'
})

const handleChange = e => {
setForm({ ...form, [e.target.name]: e.target.value })
}

const handleSubmit = async e => {
e.preventDefault()
setError('')
setLoading(true)

try {
await axios.post(`${import.meta.env.VITE_API_URL}/api/drops`, {
...form,
clerkId: user.id
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
<h1 className="text-3xl font-bold" style={{ color: '#1a1a2e' }}>Create a Drop</h1>
<p className="mt-1" style={{ color: '#9ca3af' }}>Set up your next limited release</p>
</div>

<div className="rounded-3xl p-8" style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3', boxShadow: '0 4px 24px rgba(236,72,153,0.07)' }}>

<form onSubmit={handleSubmit} className="flex flex-col gap-6">

{/* Cover image preview */}
{form.coverImage && (
<div className="w-full h-48 rounded-2xl overflow-hidden">
<img src={form.coverImage} alt="Cover preview" className="w-full h-full object-cover"
onError={e => e.target.src = '/images/drop-placeholder.jpg'} />
</div>
)}

<div className="flex flex-col gap-1">
<label className="text-sm font-medium" style={{ color: '#374151' }}>Drop Title</label>
<input
name="title"
value={form.title}
onChange={handleChange}
placeholder="e.g. Summer Capsule 2026"
required
className="px-4 py-3 rounded-xl text-sm transition-all"
style={{ border: '1px solid #fce7f3', backgroundColor: '#fff5f9', color: '#1a1a2e' }}
/>
</div>

<div className="flex flex-col gap-1">
<label className="text-sm font-medium" style={{ color: '#374151' }}>Description</label>
<textarea
name="description"
value={form.description}
onChange={handleChange}
placeholder="Tell your fans what this drop is about..."
rows={4}
required
className="px-4 py-3 rounded-xl text-sm transition-all resize-none"
style={{ border: '1px solid #fce7f3', backgroundColor: '#fff5f9', color: '#1a1a2e' }}
/>
</div>

<div className="flex flex-col gap-1">
<label className="text-sm font-medium" style={{ color: '#374151' }}>Cover Image URL</label>
<input
name="coverImage"
value={form.coverImage}
onChange={handleChange}
placeholder="Paste image URL here (from Google Images → Copy image address)"
className="px-4 py-3 rounded-xl text-sm transition-all"
style={{ border: '1px solid #fce7f3', backgroundColor: '#fff5f9', color: '#1a1a2e' }}
/>
<p className="text-xs" style={{ color: '#9ca3af' }}>
Right click any image on Google → "Copy image address" → paste here
</p>
</div>

<div className="grid grid-cols-2 gap-4">
<div className="flex flex-col gap-1">
<label className="text-sm font-medium" style={{ color: '#374151' }}>Release Date</label>
<input
type="datetime-local"
name="releaseDate"
value={form.releaseDate}
onChange={handleChange}
required
className="px-4 py-3 rounded-xl text-sm transition-all"
style={{ border: '1px solid #fce7f3', backgroundColor: '#fff5f9', color: '#1a1a2e' }}
/>
</div>

<div className="flex flex-col gap-1">
<label className="text-sm font-medium" style={{ color: '#374151' }}>Status</label>
<select
name="status"
value={form.status}
onChange={handleChange}
className="px-4 py-3 rounded-xl text-sm transition-all"
style={{ border: '1px solid #fce7f3', backgroundColor: '#fff5f9', color: '#1a1a2e' }}>
<option value="UPCOMING">UPCOMING</option>
<option value="LIVE">LIVE</option>
<option value="ENDED">ENDED</option>
</select> 
</div>
</div>

{error && (
<div className="px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3' }}>
{error}
</div>
)}

<button
type="submit"
disabled={loading}
className="w-full py-4 rounded-2xl text-white font-semibold text-base transition-all hover:opacity-90 hover:scale-105 disabled:opacity-60 disabled:scale-100"
style={{ backgroundColor: '#ec4899' }}>
{loading ? 'Creating Drop...' : 'Create Drop 🎁'}
</button>

</form>
</div>
</div>
</div>
)
}

export default CreateDrop