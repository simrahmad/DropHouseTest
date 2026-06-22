import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../../components/Navbar'

function AdminUsers() {
const navigate = useNavigate()
const [users, setUsers] = useState([])
const [loading, setLoading] = useState(true)
const [updating, setUpdating] = useState(null)

useEffect(() => {
axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`)
.then(res => setUsers(res.data))
.catch(console.error)
.finally(() => setLoading(false))
}, [])

const updateRole = async (userId, role) => {
setUpdating(userId)
try {
await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/role`, { role })
setUsers(users.map(u => u.id === userId ? { ...u, role } : u))
} catch (err) {
console.error(err)
} finally {
setUpdating(null)
}
}

const deleteUser = async (userId) => {
if (!window.confirm('Delete this user? This cannot be undone.')) return
try {
await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`)
setUsers(users.filter(u => u.id !== userId))
} catch (err) {
console.error(err)
}
}

const roleColor = (role) => {
if (role === 'ADMIN') return { bg: '#fee2e2', color: '#dc2626' }
if (role === 'SELLER') return { bg: '#fce7f3', color: '#ec4899' }
return { bg: '#f3f4f6', color: '#6b7280' }
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

<div className="max-w-6xl mx-auto px-6 py-10">

<div className="flex items-center justify-between mb-10">
<div>
<button onClick={() => navigate('/admin')}
className="text-sm mb-2 flex items-center gap-1 transition-all hover:opacity-70"
style={{ color: '#ec4899' }}>
← Back to Dashboard
</button>
<h1 className="text-3xl font-bold" style={{ color: '#1a1a2e' }}>All Users</h1>
<p className="mt-1" style={{ color: '#9ca3af' }}>{users.length} registered users</p>
</div>
</div>

<div className="rounded-3xl overflow-hidden"
style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3' }}>
<table className="w-full">
<thead>
<tr style={{ borderBottom: '1px solid #fce7f3', backgroundColor: '#fff5f9' }}>
{['User', 'Email', 'Role', 'Orders', 'Drops', 'Actions'].map(h => (
<th key={h} className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider"
style={{ color: '#9ca3af' }}>{h}</th>
))}
</tr>
</thead>
<tbody>
{users.map(user => (
<tr key={user.id} style={{ borderBottom: '1px solid #fce7f3' }}>
<td className="px-6 py-4">
<div className="flex items-center gap-3">
{user.profileImage ? (
<img src={user.profileImage} alt={user.firstName}
className="w-9 h-9 rounded-full object-cover" />
) : (
<div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
style={{ backgroundColor: '#ec4899' }}>
{user.firstName?.[0]}
</div>
)}
<span className="font-medium text-sm" style={{ color: '#1a1a2e' }}>
{user.firstName} {user.lastName}
</span>
</div>
</td>
<td className="px-6 py-4 text-sm" style={{ color: '#6b7280' }}>{user.email}</td>
<td className="px-6 py-4">
<span className="px-3 py-1 rounded-full text-xs font-bold"
style={{ backgroundColor: roleColor(user.role).bg, color: roleColor(user.role).color }}>
{user.role}
</span>
</td>
<td className="px-6 py-4 text-sm font-medium" style={{ color: '#1a1a2e' }}>
{user._count?.orders || 0}
</td>
<td className="px-6 py-4 text-sm font-medium" style={{ color: '#1a1a2e' }}>
{user._count?.drops || 0}
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<select
value={user.role}
onChange={e => updateRole(user.id, e.target.value)}
disabled={updating === user.id}
className="text-xs px-3 py-2 rounded-xl transition-all"
style={{ border: '1px solid #fce7f3', backgroundColor: '#fff5f9', color: '#1a1a2e' }}>
<option value="CUSTOMER">Customer</option>
<option value="SELLER">Seller</option>
<option value="ADMIN">Admin</option>
</select>
<button onClick={() => deleteUser(user.id)}
className="px-3 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-80"
style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
Delete
</button>
</div>
</td>
</tr>
))}
</tbody>
</table>
</div>

</div>
</div>
)
}

export default AdminUsers