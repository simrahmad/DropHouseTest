import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

const API = 'http://localhost:5000/api'

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

const s = {
page: { minHeight: '100vh', background: pink.bg, display: 'flex', fontFamily: "'Inter', sans-serif" },
sidebar: { width: 220, background: pink.card, borderRight: `1px solid ${pink.border}`, padding: '32px 0', display: 'flex', flexDirection: 'column', gap: 4 },
sideTitle: { fontSize: 20, fontWeight: 700, color: pink.accentDark, padding: '0 24px 24px' },
sideItem: active => ({
display: 'flex', alignItems: 'center', gap: 10,
padding: '10px 24px', cursor: 'pointer', fontSize: 14,
fontWeight: active ? 600 : 400,
color: active ? pink.accentDark : pink.muted,
background: active ? pink.bg : 'transparent',
borderLeft: active ? `3px solid ${pink.accent}` : '3px solid transparent',
borderRadius: '0 8px 8px 0', transition: 'all 0.15s'
}),
main: { flex: 1, padding: 32, overflow: 'auto' },
statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 },
statCard: { background: pink.card, border: `1px solid ${pink.border}`, borderRadius: 14, padding: '20px 24px' },
statNum: { fontSize: 30, fontWeight: 700, color: pink.accentDark, lineHeight: 1 },
statLabel: { fontSize: 13, color: pink.muted, marginTop: 6 },
card: { background: pink.card, border: `1px solid ${pink.border}`, borderRadius: 16, padding: 24, marginBottom: 24 },
table: { width: '100%', borderCollapse: 'collapse' },
th: { textAlign: 'left', fontSize: 12, fontWeight: 600, color: pink.muted, padding: '8px 12px', borderBottom: `1px solid ${pink.border}` },
td: { padding: '12px', fontSize: 13, color: pink.text, borderBottom: `1px solid ${pink.border}`, verticalAlign: 'middle' },
badge: status => {
const c = {
PAID: { bg: '#f0fdf4', color: '#15803d' },
PENDING: { bg: '#fffbeb', color: '#d97706' },
FAILED: { bg: '#fef2f2', color: '#dc2626' },
DELIVERED: { bg: '#f0fdf4', color: '#15803d' },
PROCESSING: { bg: '#eff6ff', color: '#1d4ed8' },
SHIPPED: { bg: '#f5f3ff', color: '#7c3aed' },
CANCELLED: { bg: '#fef2f2', color: '#dc2626' }
}[status] || { bg: '#f9fafb', color: '#6b7280' }
return { display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: c.bg, color: c.color }
},
pageTitle: { fontSize: 26, fontWeight: 700, color: pink.text, marginBottom: 4 },
pageSubtitle: { fontSize: 14, color: pink.muted, marginBottom: 24 }
}

const TABS = ['Overview', 'Sold items', 'Orders', 'Users']

export default function AdminDashboard() {
const [tab, setTab] = useState('Overview')
const { getToken } = useAuth()
const [stats, setStats] = useState(null)
const [soldItems, setSoldItems] = useState([])
const [orders, setOrders] = useState([])
const [users, setUsers] = useState([])
const [loading, setLoading] = useState(true)

async function fetchStats() {
  try {
    const token = await getToken()  // ✅ ADD THIS
    const res = await axios.get(`${API}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }  // ✅ ADD THIS
    })
setStats(res.data)
} catch {}
}

async function fetchSoldItems() {
try {
const res = await axios.get(`${API}/admin/sold-items`)
setSoldItems(res.data)
} catch {}
}

async function fetchOrders() {
try {
    const token = await getToken() 
const res = await axios.get(`${API}/admin/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }  // ✅ ADD THIS
    })

setOrders(res.data)
} catch {}
}

async function fetchUsers() {
try {
    const token = await getToken()
const res = await axios.get(`${API}/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }  // ✅ ADD THIS
    })
setUsers(res.data)
} catch {}
}

useEffect(() => {
async function init() {
await Promise.all([fetchStats(), fetchSoldItems(), fetchOrders(), fetchUsers()])
setLoading(false)
}
init()
}, [])

async function changeRole(userId, role) {
try {
    const token = await getToken()
await axios.patch(`${API}/admin/users/${userId}/role`, { role }, {
      headers: { 'Authorization': `Bearer ${token}` }  
    })
fetchUsers()
} catch {}
}

return (
<div style={s.page}>
<aside style={s.sidebar}>
<div style={s.sideTitle}><img src="/DropHouse.png"/>Admin</div>
{TABS.map(t => (
<div key={t} style={s.sideItem(tab === t)} onClick={() => setTab(t)}>
<span>{
t === 'Overview' ? '📊' :
t === 'Sold items' ? '🛍️' :
t === 'Orders' ? '📦' : '👥'
}</span>
{t}
</div>
))}
</aside>

<main style={s.main}>
{loading ? (
<div style={{ color: pink.muted, textAlign: 'center', marginTop: 60, fontSize: 14 }}>Loading...</div>
) : (
<>
{tab === 'Overview' && stats && (
<div>
    <img src="/images/AdminPage.png" className="w-500x"/>
<div style={s.pageTitle}>Dashboard overview</div>
<div style={s.pageSubtitle}>Everything happening across DropHouse right now.</div>
<div style={s.statsRow}>
<div style={s.statCard}><div style={s.statNum}>{stats.totalOrders}</div><div style={s.statLabel}>Total orders</div></div>
<div style={s.statCard}><div style={s.statNum}>${parseFloat(stats.totalRevenue).toFixed(0)}</div><div style={s.statLabel}>Revenue (paid)</div></div>
<div style={s.statCard}><div style={s.statNum}>{stats.soldItems}</div><div style={s.statLabel}>Items sold</div></div>
</div>
<div style={{ ...s.statsRow, gridTemplateColumns: 'repeat(3, 1fr)' }}>
<div style={s.statCard}><div style={s.statNum}>{stats.totalUsers}</div><div style={s.statLabel}>Total users</div></div>
<div style={s.statCard}><div style={s.statNum}>{stats.totalDrops}</div><div style={s.statLabel}>Total drops</div></div>
<div style={s.statCard}><div style={s.statNum}>{stats.totalProducts}</div><div style={s.statLabel}>Total products</div></div>
</div>
</div>
)}

{tab === 'Sold items' && (
<div>
<div style={s.pageTitle}>Sold items</div>
<div style={s.pageSubtitle}>All products that have been purchased and paid for.</div>
<div style={s.card}>
{soldItems.length === 0 ? (
<p style={{ color: pink.muted, fontSize: 14 }}>No sold items yet.</p>
) : (
<table style={s.table}>
<thead>
<tr>
<th style={s.th}>Product</th>
<th style={s.th}>Qty</th>
<th style={s.th}>Unit price</th>
<th style={s.th}>Total</th>
<th style={s.th}>Buyer</th>
<th style={s.th}>Order status</th>
<th style={s.th}>Date</th>
</tr>
</thead>
<tbody>
{soldItems.map((item, i) => (
<tr key={i}>
<td style={s.td}>
<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
<img src={item.product.imageUrl} alt={item.product.name}
style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', border: `1px solid ${pink.border}` }} />
<div>
<div style={{ fontWeight: 600 }}>{item.product.name}</div>
<div style={{ fontSize: 11, color: pink.muted }}>{item.product.category || '—'}</div>
</div>
</div>
</td>
<td style={s.td}>{item.quantity}</td>
<td style={s.td}>${parseFloat(item.unitPrice).toFixed(2)}</td>
<td style={{ ...s.td, fontWeight: 600, color: pink.accentDark }}>
${(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
</td>
<td style={s.td}>
{item.order.user.firstName} {item.order.user.lastName}
<div style={{ fontSize: 11, color: pink.muted }}>{item.order.user.email}</div>
</td>
<td style={s.td}><span style={s.badge(item.order.status)}>{item.order.status}</span></td>
<td style={s.td}>{new Date(item.order.createdAt).toLocaleDateString()}</td>
</tr>
))}
</tbody>
</table>
)}
</div>
</div>
)}

{tab === 'Orders' && (
<div>
<div style={s.pageTitle}>All orders</div>
<div style={s.pageSubtitle}>Every order placed on DropHouse.</div>
<div style={s.card}>
<table style={s.table}>
<thead>
<tr>
<th style={s.th}>Order ID</th>
<th style={s.th}>Customer</th>
<th style={s.th}>Amount</th>
<th style={s.th}>Status</th>
<th style={s.th}>Payment</th>
<th style={s.th}>Date</th>
</tr>
</thead>
<tbody>
{orders.map(o => (
<tr key={o.id}>
<td style={s.td}><span style={{ fontSize: 11, fontFamily: 'monospace', color: pink.muted }}>{o.id.slice(0, 10)}...</span></td>
<td style={s.td}>
{o.user.firstName} {o.user.lastName}
<div style={{ fontSize: 11, color: pink.muted }}>{o.user.email}</div>
</td>
<td style={{ ...s.td, fontWeight: 600 }}>${parseFloat(o.totalAmount).toFixed(2)}</td>
<td style={s.td}><span style={s.badge(o.status)}>{o.status}</span></td>
<td style={s.td}><span style={s.badge(o.paymentStatus)}>{o.paymentStatus}</span></td>
<td style={s.td}>{new Date(o.createdAt).toLocaleDateString()}</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
)}

{tab === 'Users' && (
<div>
<div style={s.pageTitle}>All users</div>
<div style={s.pageSubtitle}>Manage user roles and see account details.</div>
<div style={s.card}>
<table style={s.table}>
<thead>
<tr>
<th style={s.th}>User</th>
<th style={s.th}>Email</th>
<th style={s.th}>Role</th>
<th style={s.th}>Orders</th>
<th style={s.th}>Drops</th>
<th style={s.th}>Joined</th>
<th style={s.th}>Change role</th>
</tr>
</thead>
<tbody>
{users.map(u => (
<tr key={u.id}>
<td style={s.td}>{u.firstName} {u.lastName || ''}</td>
<td style={{ ...s.td, fontSize: 12, color: pink.muted }}>{u.email}</td>
<td style={s.td}><span style={s.badge(u.role)}>{u.role}</span></td>
<td style={s.td}>{u._count.orders}</td>
<td style={s.td}>{u._count.drops}</td>
<td style={{ ...s.td, fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
<td style={s.td}>
<select
defaultValue={u.role}
onChange={e => changeRole(u.id, e.target.value)}
style={{
padding: '5px 10px', borderRadius: 8, fontSize: 12,
border: `1px solid ${pink.border}`, background: pink.bg,
color: pink.text, cursor: 'pointer'
}}
>
<option value="CUSTOMER">Customer</option>
<option value="SELLER">Seller</option>
<option value="ADMIN">Admin</option>
</select>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
)}
</>
)}
</main>
</div>
)
}