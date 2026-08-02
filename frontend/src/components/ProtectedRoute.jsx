import { useAuth } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
const { isSignedIn, isLoaded } = useAuth()

if (!isLoaded) {
return (
   <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fff5f9' }}>
   <div className="flex flex-col items-center gap-3">
   <div className="w-10 h-10 rounded-full border-4 border-pink-300 border-t-pink-500 animate-spin" />
    <p className="text-pink-400 text-sm font-medium">Loading DropHouse...</p>
</div>
</div>)}
if (!isSignedIn) {return <Navigate to="/login" />}

return children}

export default ProtectedRoute