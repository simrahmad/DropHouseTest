import { useState, useEffect } from 'react'
import { useUser, useAuth } from '@clerk/clerk-react'
import axios from 'axios'
import ImageUpload from '../../components/ImageUpload'

const API = `http://localhost:5000/api`

const pink = {
bg: '#fff5f9',
card: '#ffffff',
border: '#fce7f3',
accent: '#ec4899',
accentLight: '#f9a8d4',

accentDark: '#be185d',
text: '#1f2937',
muted: '#6b7280',
success: '#10b981',
danger: '#ef4444',
tag: '#fdf2f8',
tagText: '#9d174d'
}

const styles = {
container: {
minHeight: '100vh',
background: pink.bg,
fontFamily: "'Inter', sans-serif",
display: 'flex'
},
sidebar: {
width: 240,
background: pink.card,
borderRight: `1px solid ${pink.border}`,
padding: '32px 0',
display: 'flex',
flexDirection: 'column',
gap: 4,
flexShrink: 0
},
sidebarTitle: {
fontSize: 20,
fontWeight: 700,
color: pink.accentDark,
padding: '0 24px 24px',
letterSpacing: '-0.5px'
},
sidebarItem: active => ({
display: 'flex',
alignItems: 'center',
gap: 10,
padding: '10px 24px',
cursor: 'pointer',
fontSize: 14,
fontWeight: active ? 600 : 400,
color: active ? pink.accentDark : pink.muted,
background: active ? pink.bg : 'transparent',
borderLeft: active ? `3px solid ${pink.accent}` : '3px solid transparent',
borderRadius: '0 8px 8px 0',
transition: 'all 0.15s'
}),
main: {
flex: 1,
padding: 32,
overflow: 'auto'
},
pageHeader: {
marginBottom: 28
},
pageTitle: {
fontSize: 26,
fontWeight: 700,
color: pink.text,
marginBottom: 4
},
pageSubtitle: {
fontSize: 14,
color: pink.muted
},
card: {
background: pink.card,
border: `1px solid ${pink.border}`,
borderRadius: 16,
padding: 24,
marginBottom: 24
},
sectionTitle: {
fontSize: 16,
fontWeight: 600,
color: pink.text,
marginBottom: 16
},
grid2: {
display: 'grid',
gridTemplateColumns: '1fr 1fr',
gap: 16
},
label: {
display: 'block',
fontSize: 13,
fontWeight: 500,
color: pink.text,
marginBottom: 6
},
input: {
width: '100%',
padding: '10px 14px',
border: `1px solid ${pink.border}`,
borderRadius: 10,
fontSize: 14,
color: pink.text,
background: pink.bg,
outline: 'none',
boxSizing: 'border-box',
transition: 'border-color 0.15s'
},
textarea: {
width: '100%',
padding: '10px 14px',
border: `1px solid ${pink.border}`,
borderRadius: 10,
fontSize: 14,
color: pink.text,
background: pink.bg,
outline: 'none',
boxSizing: 'border-box',
resize: 'vertical',
minHeight: 90,
fontFamily: 'inherit',
transition: 'border-color 0.15s'
},
btn: {
padding: '10px 22px',
background: pink.accent,
color: '#fff',
border: 'none',
borderRadius: 10,
fontSize: 14,
fontWeight: 600,
cursor: 'pointer',
transition: 'background 0.15s'
},
btnOutline: {
padding: '8px 18px',
background: 'transparent',
color: pink.accent,
border: `1.5px solid ${pink.accent}`,
borderRadius: 10,
fontSize: 13,
fontWeight: 600,
cursor: 'pointer'
},
btnDanger: {
padding: '6px 14px',
background: 'transparent',
color: pink.danger,
border: `1.5px solid ${pink.danger}`,
borderRadius: 8,
fontSize: 12,
cursor: 'pointer'
},
btnSuccess: {
padding: '8px 18px',
background: pink.success,
color: '#fff',
border: 'none',
borderRadius: 10,
fontSize: 13,
fontWeight: 600,
cursor: 'pointer'
},
dropCard: {
border: `1px solid ${pink.border}`,
borderRadius: 14,
overflow: 'hidden',
background: pink.card,
marginBottom: 16
},
dropCardImg: {
width: '100%',
height: 140,
objectFit: 'cover'
},
dropCardBody: {
padding: '14px 16px'
},
tag: status => {
const colors = {
UPCOMING: { bg: '#eff6ff', color: '#1d4ed8' },
LIVE: { bg: '#f0fdf4', color: '#15803d' },
ENDED: { bg: '#f9fafb', color: '#6b7280' }
}
const c = colors[status] || colors.UPCOMING
return {
display: 'inline-block',
padding: '2px 10px',
borderRadius: 20,
fontSize: 11,
fontWeight: 600,
background: c.bg,
color: c.color,
marginBottom: 8
}
},
productRow: {
display: 'flex',
alignItems: 'center',
gap: 14,
padding: '12px 0',
borderBottom: `1px solid ${pink.border}`
},
productRowImg: {
width: 52,
height: 52,
borderRadius: 10,
objectFit: 'cover',
border: `1px solid ${pink.border}`
},
select: {
width: '100%',
padding: '10px 14px',
border: `1px solid ${pink.border}`,
borderRadius: 10,
fontSize: 14,
color: pink.text,
background: pink.bg,
outline: 'none',
boxSizing: 'border-box'
},
statsRow: {
display: 'grid',
gridTemplateColumns: 'repeat(3, 1fr)',
gap: 16,
marginBottom: 24
},
statCard: {
background: pink.card,
border: `1px solid ${pink.border}`,
borderRadius: 14,
padding: '20px 24px'
},
statNum: {
fontSize: 30,
fontWeight: 700,
color: pink.accentDark,
lineHeight: 1
},
statLabel: {
fontSize: 13,
color: pink.muted,
marginTop: 6
}
}

// ─── sub-components ───────────────────────────────────────────────

function FormField({ label, children }) {
return (
<div>
<label style={styles.label}>{label}</label>
{children}
</div>
)
}

function CreateDropForm({ onCreated, userId })  {
const [form, setForm] = useState({
title: '', description: '', coverImage: '',
releaseDate: '', endDate: ''
})
const [loading, setLoading] = useState(false)
const [msg, setMsg] = useState('')



async function submit() {
if (!form.title || !form.description || !form.coverImage || !form.releaseDate || !form.endDate) {
setMsg('Please fill in all fields and upload a cover image.')
return
}

setLoading(true)
try {
await axios.post(`${API}/drops`, { ...form, clerkId: userId })
setMsg('Drop created!')
// missing closing } for try block here
} catch (err) {
setMsg(err.response?.data?.error || 'Something went wrong')
} finally {
setLoading(false)
}
}



return (
<div style={styles.card}>
<div style={styles.sectionTitle}>Create a new drop</div>
<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
<div style={styles.grid2}>
<FormField label="Drop title">
<input
style={styles.input}
value={form.title}
onChange={e => setForm({ ...form, title: e.target.value })}
placeholder="e.g. Summer Hype Vol. 2"
onFocus={e => e.target.style.borderColor = pink.accent}
onBlur={e => e.target.style.borderColor = pink.border}
/>
</FormField>
<FormField label="Release date & time">
<input
style={styles.input}
type="datetime-local"
value={form.releaseDate}
onChange={e => setForm({ ...form, releaseDate: e.target.value })}
onFocus={e => e.target.style.borderColor = pink.accent}
onBlur={e => e.target.style.borderColor = pink.border}
/>
</FormField>
</div>
<FormField label="End date & time">
<input
style={styles.input}
type="datetime-local"
value={form.endDate}
onChange={e => setForm({ ...form, endDate: e.target.value })}
onFocus={e => e.target.style.borderColor = pink.accent}
onBlur={e => e.target.style.borderColor = pink.border}/>

</FormField>
<FormField label="Description">
<textarea
style={styles.textarea}
value={form.description}
onChange={e => setForm({ ...form, description: e.target.value })}
placeholder="Tell buyers what this drop is about..."
onFocus={e => e.target.style.borderColor = pink.accent}
onBlur={e => e.target.style.borderColor = pink.border}/>

</FormField>
<FormField label="Cover image">
<ImageUpload
label="Upload drop cover"
onUpload={url => setForm(prev => ({ ...prev, coverImage: url }))}
currentUrl={form.coverImage}/>

</FormField>
</div>{msg && ( <p style={{ marginTop: 12, fontSize: 13, color: msg.includes('created') ? pink.success : pink.danger }}>{msg}</p>)}
<button style={{ ...styles.btn, marginTop: 20 }} onClick={submit}  disabled={loading}>
{loading ? 'Creating...' : 'Create drop'}</button></div>)}

function DropList({ drops, allProducts, onRefresh }) {
const [expanded, setExpanded] = useState(null)
const [addingProductId, setAddingProductId] = useState('')
const [msg, setMsg] = useState({})

async function addProduct(dropId) {
if (!addingProductId) return
try {
    await axios.patch(`${API}/drops/${dropId}/add-product`, { productId: addingProductId })
     setAddingProductId('')
   setMsg({ ...msg, [dropId]: 'Product added!' })
   onRefresh()
setTimeout(() => setMsg(m => ({ ...m, [dropId]: '' })), 2500)
} catch (err) {
setMsg({ ...msg, [dropId]: err.response?.data?.error || 'Failed' })}}

async function removeProduct(dropId, productId) {
try {
await axios.patch(`${API}/drops/${dropId}/remove-product`, { productId })
onRefresh()
} catch {}}

async function publish(dropId) {
try {
await axios.patch(`${API}/drops/${dropId}/publish`)
onRefresh()
} catch (err) {
alert(err.response?.data?.error || 'Failed to publish')}}
async function deleteDrop(dropId) {
if (!window.confirm('Delete this drop and all its products?')) return
try {
await axios.delete(`${API}/drops/${dropId}`)
onRefresh()
} catch (err) {
alert(err.response?.data?.message || 'Failed to delete drop')}}

if (drops.length === 0) {
return (
<div style={{ textAlign: 'center', padding: '40px 0', color: pink.muted, fontSize: 14 }}>
No drops yet. Create one above!
</div>)
}

return (
<div>
{drops.map(drop => {
const dropProducts = allProducts.filter(p => p.dropId === drop.id)
const unassigned = allProducts.filter(p => !p.dropId)
const isOpen = expanded === drop.id

return (
<div key={drop.id} style={styles.dropCard}>
{drop.coverImage && (
<img src={drop.coverImage} alt={drop.title} style={styles.dropCardImg} />
)}
<div style={styles.dropCardBody}>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
<div>
<span style={styles.tag(drop.status)}>{drop.status}</span>
{!drop.isReady && (
<span style={{ ...styles.tag('UPCOMING'), marginLeft: 6, background: '#fdf2f8', color: pink.accentDark }}>
Draft
</span>
)}
<div style={{ fontWeight: 700, fontSize: 16, color: pink.text }}>{drop.title}</div>
<div style={{ fontSize: 12, color: pink.muted, marginTop: 2 }}>
{dropProducts.length} product{dropProducts.length !== 1 ? 's' : ''} · releases{' '}
{new Date(drop.releaseDate).toLocaleDateString()} · ends{' '}
{new Date(drop.endDate).toLocaleDateString()}
</div>
</div>
<div style={{ display: 'flex', gap: 8, flexDirection: 'column', alignItems: 'flex-end' }}>
<button style={styles.btnOutline} onClick={() => setExpanded(isOpen ? null : drop.id)}>
{isOpen ? 'Close' : 'Manage'}
</button>
{!drop.isReady && dropProducts.length > 0 && (
<button style={styles.btnSuccess} onClick={() => publish(drop.id)}>
Publish drop
</button>
)}
<button
onClick={() => deleteDrop(drop.id)}
style={styles.btnDanger}>
Delete drop
</button>
</div>
</div>

{isOpen && (
<div style={{ marginTop: 16, borderTop: `1px solid ${pink.border}`, paddingTop: 16 }}>
<div style={{ fontSize: 13, fontWeight: 600, color: pink.text, marginBottom: 10 }}>
Products in this drop
</div>

{dropProducts.length === 0 ? (
<p style={{ fontSize: 13, color: pink.muted }}>No products yet.</p>
) : (
dropProducts.map(p => (
<div key={p.id} style={styles.productRow}>
<img src={p.imageUrl} alt={p.name} style={styles.productRowImg} />
<div style={{ flex: 1 }}>
<div style={{ fontSize: 14, fontWeight: 600, color: pink.text }}>{p.name}</div>
<div style={{ fontSize: 12, color: pink.muted }}>${parseFloat(p.price).toFixed(2)} · stock: {p.stock}</div>
</div>
<button style={styles.btnDanger} onClick={() => removeProduct(drop.id, p.id)}>
Remove
</button>
</div>
))
)}

<div style={{ marginTop: 14 }}>
<div style={{ fontSize: 13, fontWeight: 600, color: pink.text, marginBottom: 8 }}>
Add an existing product
</div>
<div style={{ display: 'flex', gap: 10 }}>
<select
style={{ ...styles.select, flex: 1 }}
value={addingProductId}
onChange={e => setAddingProductId(e.target.value)}
>
<option value="">Select a product...</option>
{unassigned.map(p => (
<option key={p.id} value={p.id}>{p.name}</option>
))}
</select>
<button style={styles.btn} onClick={() => addProduct(drop.id)}>
Add
</button>
</div>
{msg[drop.id] && (
<p style={{ fontSize: 12, color: pink.success, marginTop: 6 }}>{msg[drop.id]}</p>
)}
</div>
</div>
)}
</div>
</div>
)
})}
</div>
)
}

function CreateProductForm({ drops, onCreated, userId }) {
  const { getToken } = useAuth()
const [form, setForm] = useState({
name: '', description: '', price: '', stock: '',
imageUrl: '', category: '', sku: '', dropId: ''
})
const [loading, setLoading] = useState(false)
const [msg, setMsg] = useState('')

async function submit() {
  if (!userId) {
    setMsg('User not found. Please refresh the page.')
    return
  }
  if (!form.name || !form.description || !form.price || !form.stock || !form.imageUrl) {
    setMsg('Please fill in all required fields and upload a product image.')
    return
  }
  setLoading(true)
  try {
    const token = await getToken()
    await axios.post(`${API}/products`, { ...form, clerkId: userId }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setMsg('Product created!')
    setForm({ name: '', description: '', price: '', stock: '', imageUrl: '', category: '', sku: '', dropId: '' })
    onCreated()
  } catch (err) {
    setMsg(err.response?.data?.error || 'Something went wrong')
  } finally {
    setLoading(false)
  }
}
return (
<div style={styles.card}>
<div style={styles.sectionTitle}>Add a new product</div>
<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
<div style={styles.grid2}>
<FormField label="Product name *">
<input style={styles.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
placeholder="e.g. Limited Edition Hoodie"
onFocus={e => e.target.style.borderColor = pink.accent}
onBlur={e => e.target.style.borderColor = pink.border} />
</FormField>
<FormField label="Price (USD) *">
<input style={styles.input} type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
placeholder="e.g. 89.99"
onFocus={e => e.target.style.borderColor = pink.accent}
onBlur={e => e.target.style.borderColor = pink.border} />
</FormField>
</div>
<div style={styles.grid2}>
<FormField label="Stock *">
<input style={styles.input} type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })}
placeholder="e.g. 50"
onFocus={e => e.target.style.borderColor = pink.accent}
onBlur={e => e.target.style.borderColor = pink.border} />
</FormField>
<FormField label="Category">
<input style={styles.input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
placeholder="e.g. Hoodies"
onFocus={e => e.target.style.borderColor = pink.accent}
onBlur={e => e.target.style.borderColor = pink.border} />
</FormField>
</div>
<div style={styles.grid2}>
<FormField label="SKU">
<input style={styles.input} value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })}
placeholder="Optional"
onFocus={e => e.target.style.borderColor = pink.accent}
onBlur={e => e.target.style.borderColor = pink.border} />
</FormField>
<FormField label="Assign to drop (optional)">
<select style={styles.select} value={form.dropId} onChange={e => setForm({ ...form, dropId: e.target.value })}>
<option value="">No drop (standalone)</option>
{drops.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
</select>
</FormField>
</div>
<FormField label="Description *">
<textarea style={styles.textarea} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
placeholder="Describe the product..."
onFocus={e => e.target.style.borderColor = pink.accent}
onBlur={e => e.target.style.borderColor = pink.border} />
</FormField>
<FormField label="Product image *">
<ImageUpload 
label="Upload product image" 
onUpload={url => setForm(prev => ({ ...prev, imageUrl: url }))}
currentUrl={form.imageUrl} 
/>
</FormField>
</div>
{msg && (
<p style={{ marginTop: 12, fontSize: 13, color: msg.includes('created') ? pink.success : pink.danger }}>
{msg}
</p>
)}
<button style={{ ...styles.btn, marginTop: 20 }} onClick={submit} disabled={loading}>
{loading ? 'Saving...' : 'Save product'}
</button>
</div>
)
}

function ProductList({ products, drops }) {
if (products.length === 0) {
return (
<div style={{ textAlign: 'center', padding: '40px 0', color: pink.muted, fontSize: 14 }}>
No products yet. Add one above!
</div>
)
}

return (
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
{products.map(p => (
<div key={p.id} style={{
...styles.dropCard,
borderRadius: 14,
overflow: 'hidden',
boxShadow: '0 1px 6px rgba(236,72,153,0.07)'
}}>
<img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
<div style={{ padding: '12px 14px' }}>
<div style={{ fontWeight: 700, fontSize: 15, color: pink.text }}>{p.name}</div>
<div style={{ fontSize: 12, color: pink.muted, marginTop: 3 }}>{p.category || 'Uncategorized'}</div>
<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' }}>
<span style={{ fontWeight: 700, color: pink.accentDark, fontSize: 16 }}>
${parseFloat(p.price).toFixed(2)}
</span>
<span style={{ fontSize: 12, color: pink.muted }}>
{p.stock} left
</span>
</div>
{p.drop ? (
<div style={{
marginTop: 8, fontSize: 11, color: pink.tagText,
background: pink.tag, borderRadius: 6, padding: '2px 8px', display: 'inline-block'
}}>
{p.drop.title}
</div>
) : (
<div style={{
marginTop: 8, fontSize: 11, color: pink.muted,
background: '#f9fafb', borderRadius: 6, padding: '2px 8px', display: 'inline-block'
}}>
Standalone
</div>
)}
</div>
</div>
))}
</div>
)
}

// ─── main seller dashboard ────────────────────────────────────────

const TABS = ['Overview', 'Drops', 'Products']

export default function SellerDashboard() {
const { user } = useUser()
const [tab, setTab] = useState('Overview')
const [drops, setDrops] = useState([])
const [products, setProducts] = useState([])
const [loading, setLoading] = useState(true)

async function fetchData() {
if (!user) return
try {
const [dropsRes, productsRes] = await Promise.all([
axios.get(`${API}/drops/seller/${user.id}`),
axios.get(`${API}/products?sellerId=${user.id}`)
])
setDrops(dropsRes.data)
setProducts(productsRes.data)
} catch (err) {
console.error('Failed to load data', err)
} finally {
setLoading(false)
}
}
useEffect(() => { 
if (user) fetchData() 
}, [user])

const liveDrops = drops.filter(d => d.status === 'LIVE').length
const totalRevenue = 0 // would come from orders in a real scenario

return (
<div style={styles.container}>

{/* sidebar */}
<aside style={styles.sidebar}>
<div style={styles.sidebarTitle}> <img src="/DropHouse.png"/></div>
{TABS.map(t => (
<div key={t} style={styles.sidebarItem(tab === t)} onClick={() => setTab(t)}>
<span>{t === 'Overview' ? '📊' : t === 'Drops' ? '🔥' : '📦'}</span>
{t}
</div>
))}
<div style={{ marginTop: 'auto', padding: '0 24px' }}>
<div style={{
background: pink.bg,
border: `1px solid ${pink.border}`,
borderRadius: 12,
padding: '12px 14px'
}}>
<div style={{ fontSize: 12, color: pink.muted }}>Logged in as</div>
<div style={{ fontSize: 13, fontWeight: 600, color: pink.text, marginTop: 2 }}>
{user?.firstName} {user?.lastName}
</div>
<div style={{
marginTop: 6, fontSize: 11, background: pink.accentLight,
color: '#fff', borderRadius: 6, padding: '2px 8px',
display: 'inline-block', fontWeight: 600
}}>
Seller
</div>
</div>
</div>
</aside>

{/* main */}
<main style={styles.main}>
{loading ? (
<div style={{ color: pink.muted, fontSize: 14, marginTop: 40, textAlign: 'center' }}>Loading...</div>
) : (
<>
{tab === 'Overview' && (
<div>
    
<div style={styles.pageHeader}>
<div style={styles.pageTitle}>Welcome back, {user?.firstName} 👋</div>
<img   src="/SellerPage.png" alt="Seller page" className="w-500 h-100" />
<div style={styles.pageSubtitle}>Here's what's happening with your store.</div>
</div>
<div style={styles.statsRow}>
<div style={styles.statCard}>
<div style={styles.statNum}>{drops.length}</div>
<div style={styles.statLabel}>Total drops</div>
</div>
<div style={styles.statCard}>
<div style={styles.statNum}>{liveDrops}</div>
<div style={styles.statLabel}>Live now</div>
</div>
<div style={styles.statCard}>
<div style={styles.statNum}>{products.length}</div>
<div style={styles.statLabel}>Products</div>
</div>
</div>

<div style={styles.sectionTitle}>Your recent drops</div>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
{drops.slice(0, 4).map(d => (
<div key={d.id} style={{ ...styles.dropCard, cursor: 'pointer' }} onClick={() => setTab('Drops')}>
{d.coverImage && <img src={d.coverImage} alt={d.title} style={styles.dropCardImg} />}
<div style={styles.dropCardBody}>
<span style={styles.tag(d.status)}>{d.status}</span>
<div style={{ fontWeight: 700, fontSize: 15, color: pink.text }}>{d.title}</div>
<div style={{ fontSize: 12, color: pink.muted, marginTop: 3 }}>
{d.products.length} products
</div>
</div>
</div>
))}
</div>
</div>
)}

{tab === 'Drops' && (

<div>
<div style={styles.pageHeader}>
<div style={styles.pageTitle}>Drops</div>
<div style={styles.pageSubtitle}>Create drops, add products to them, then publish when ready.</div>
</div>
<CreateDropForm onCreated={fetchData} userId={user?.id} />
<div style={styles.card}>
<div style={styles.sectionTitle}>Your drops ({drops.length})</div>
<DropList drops={drops} allProducts={products} onRefresh={fetchData} />
</div>
</div>

)}

{tab === 'Products' && (
<div>
<div style={styles.pageHeader}>
<div style={styles.pageTitle}>Products</div>
<div style={styles.pageSubtitle}>Add products standalone or assign them to a drop.</div>
</div>

<CreateProductForm drops={drops} onCreated={fetchData} userId={user?.id} />
<div style={styles.card}>
<div style={styles.sectionTitle}>All your products ({products.length})</div>
<ProductList products={products} drops={drops} />
</div>
</div>
)}
</>
)}
</main>
</div>
)
}