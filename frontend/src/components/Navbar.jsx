import { Link } from 'react-router-dom'
import { useAuth, UserButton, useUser } from '@clerk/clerk-react'
import { ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from 'axios'

function Navbar() {
const { isSignedIn } = useAuth()
const { user } = useUser()
const [cartCount, setCartCount] = useState(0)

useEffect(() => {
if (!user) return
axios.get(`${import.meta.env.VITE_API_URL}/api/cart/${user.id}`)
.then(res => {
const count = res.data?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
setCartCount(count)
})
.catch(() => setCartCount(0))
}, [user])

return (
<nav className="w-full bg-white border-b border-pink-100 px-8 py-3 flex items-center justify-between sticky top-0 z-50">
<Link to="/" className="flex items-center gap-2">
<img src="/DropHouse.png" className="w-10 h-10"/>
<span className="font-black text-xl text-gray-900 tracking-tight">DropHouse</span>
</Link>

<div className="hidden md:flex items-center gap-8">
{['Drops', 'Products', 'My Orders'].map(link => (
<Link key={link} to={`/${link.toLowerCase().replace(' ', '-')}`}
className="text-sm font-semibold text-gray-600 hover:text-pink-500 transition-colors duration-200 relative group">
{link}
<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-400 group-hover:w-full transition-all duration-200" />
</Link>
))}
</div>

<div className="flex items-center gap-4">
<Link to="/cart" className="relative p-2 rounded-full hover:bg-pink-50 transition-colors">
<ShoppingCart className="w-5 h-5 text-gray-700" />
{cartCount > 0 && (
<span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
{cartCount}
</span>
)}
</Link>

{isSignedIn ? (
<UserButton appearance={{ elements: { avatarBox: 'w-9 h-9 rounded-full' } }} />
) : (
<Link to="/login">
<button className="bg-pink-500 text-white text-sm font-bold px-5 py-2 rounded-full hover:bg-pink-600 transition-colors duration-200">
Sign in
</button>
</Link>
)}
</div>
</nav>
)
}

export default Navbar