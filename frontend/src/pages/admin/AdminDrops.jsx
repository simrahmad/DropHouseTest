import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'  // ✅ ADD THIS
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../../components/Navbar'

function AdminDrops() {
  const { getToken } = useAuth()  // ✅ ADD THIS
  const navigate = useNavigate()
  const [drops, setDrops] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDrops = async () => {  // ✅ MAKE THIS ASYNC
      try {
        const token = await getToken()  // ✅ GET TOKEN INSIDE ASYNC
        const res = await axios.get(`http://localhost:5000/api/admin/drops`, {
          headers: { 'Authorization': `Bearer ${token}` }  // ✅ SEND TOKEN
        })
        setDrops(res.data)
      } catch (err) {
        console.error('Failed to load drops:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDrops()  // ✅ CALL THE ASYNC FUNCTION
  }, [getToken])

  const deleteDrop = async (dropId) => {
    if (!window.confirm('Delete this drop and all its products?')) return
    try {
      const token = await getToken()  // ✅ GET TOKEN
      await axios.delete(`http://localhost:5000/api/admin/drops/${dropId}`, {
        headers: { 'Authorization': `Bearer ${token}` }  // ✅ SEND TOKEN
      })
      setDrops(drops.filter(d => d.id !== dropId))
    } catch (err) {
      console.error(err)
    }
  }

  const statusColor = (status) => {
    if (status === 'LIVE') return { bg: '#fce7f3', color: '#ec4899' }
    if (status === 'UPCOMING') return { bg: '#fef9c3', color: '#ca8a04' }
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

        <div className="mb-10">
          <button onClick={() => navigate('/admin')}
            className="text-sm mb-2 flex items-center gap-1 transition-all hover:opacity-70"
            style={{ color: '#ec4899' }}>
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold" style={{ color: '#1a1a2e' }}>All Drops</h1>
          <p className="mt-1" style={{ color: '#9ca3af' }}>{drops.length} drops on the platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {drops.map(drop => (
            <div key={drop.id} className="rounded-3xl overflow-hidden"
              style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3', boxShadow: '0 2px 12px rgba(236,72,153,0.06)' }}>

              <div className="relative h-44 overflow-hidden">
                <img src={drop.coverImage} alt={drop.title}
                  className="w-full h-full object-cover"
                  onError={e => e.target.src = '/images/drop1.jpg'} />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: statusColor(drop.status).bg, color: statusColor(drop.status).color }}>
                    {drop.status}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold mb-1" style={{ color: '#1a1a2e' }}>{drop.title}</h3>
                <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>
                  by {drop.seller?.firstName} {drop.seller?.lastName}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: '#6b7280' }}>
                    {drop._count?.products || 0} products
                  </span>
                  <button onClick={() => deleteDrop(drop.id)}
                    className="px-4 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-80"
                    style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                    Delete
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default AdminDrops