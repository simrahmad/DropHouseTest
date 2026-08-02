import { useUser } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

function SellerRoute({ children }) {
const { user, isLoaded } = useUser()
const [role, setRole] = useState(null)
const [checking, setChecking] = useState(true)

useEffect(() => {
if (!isLoaded || !user) return

const check = async () => {
try {
const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me/${user.id}`)
setRole(res.data.role)
} catch {
setRole(null)
} finally {
setChecking(false)
}
}

check()
}, [isLoaded, user])

if (!isLoaded || checking) {
return (
<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fff5f9' }}>
<div className="w-10 h-10 rounded-full border-4 border-pink-300 border-t-pink-500 animate-spin" />
</div>
)
}

if (role !== 'SELLER' && role !== 'ADMIN') {return <Navigate to="/" />}

return children
}

export default SellerRoute