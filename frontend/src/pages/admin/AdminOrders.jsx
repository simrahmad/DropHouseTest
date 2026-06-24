import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'  // ✅ ADD THIS
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../../components/Navbar'

function AdminOrders() {
  const { getToken } = useAuth()  // ✅ ADD THIS
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    const fetchOrders = async () => {  // ✅ MAKE THIS ASYNC
      try {
        const token = await getToken()  // ✅ GET TOKEN INSIDE ASYNC
        const res = await axios.get(`http://localhost:5000/api/admin/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }  // ✅ SEND TOKEN
        })
        setOrders(res.data)
      } catch (err) {
        console.error('Failed to load orders:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()  // ✅ CALL THE ASYNC FUNCTION
  }, [getToken])

  const statusColor = (status) => {
    if (status === 'DELIVERED') return { bg: '#dcfce7', color: '#16a34a' }
    if (status === 'SHIPPED') return { bg: '#dbeafe', color: '#2563eb' }
    if (status === 'PROCESSING') return { bg: '#fef9c3', color: '#ca8a04' }
    if (status === 'CANCELLED') return { bg: '#fee2e2', color: '#dc2626' }
    return { bg: '#fce7f3', color: '#ec4899' }
  }

  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter)
  const totalRevenue = orders.reduce((acc, o) => acc + parseFloat(o.totalAmount), 0)

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
          <h1 className="text-3xl font-bold" style={{ color: '#1a1a2e' }}>All Orders</h1>
          <p className="mt-1" style={{ color: '#9ca3af' }}>
            {orders.length} orders — Total Revenue: ${totalRevenue.toFixed(2)}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(tab => (
            <button key={tab}
              onClick={() => setFilter(tab)}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                backgroundColor: filter === tab ? '#ec4899' : '#ffffff',
                color: filter === tab ? '#ffffff' : '#6b7280',
                border: '1px solid',
                borderColor: filter === tab ? '#ec4899' : '#fce7f3'
              }}>
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-5">
          {filtered.map(order => (
            <div key={order.id} className="rounded-3xl overflow-hidden"
              style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3', boxShadow: '0 2px 12px rgba(236,72,153,0.06)' }}>

              <div className="px-6 py-4 flex items-center justify-between flex-wrap gap-4"
                style={{ borderBottom: '1px solid #fce7f3', backgroundColor: '#fff5f9' }}>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>Order</p>
                  <p className="font-mono text-sm font-bold" style={{ color: '#1a1a2e' }}>
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>Customer</p>
                  <p className="text-sm font-medium" style={{ color: '#1a1a2e' }}>
                    {order.user?.firstName} {order.user?.lastName}
                  </p>
                  <p className="text-xs" style={{ color: '#9ca3af' }}>{order.user?.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>Date</p>
                  <p className="text-sm" style={{ color: '#1a1a2e' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>Total</p>
                  <p className="text-lg font-bold" style={{ color: '#ec4899' }}>
                    ${parseFloat(order.totalAmount).toFixed(2)}
                  </p>
                </div>
                <span className="px-4 py-2 rounded-full text-xs font-bold"
                  style={{ backgroundColor: statusColor(order.status).bg, color: statusColor(order.status).color }}>
                  {order.status}
                </span>
              </div>

              <div className="px-6 py-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.product?.imageUrl} alt={item.product?.name}
                        className="w-full h-full object-cover"
                        onError={e => e.target.src = '/images/product1.jpg'} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: '#1a1a2e' }}>{item.product?.name}</p>
                      <p className="text-xs" style={{ color: '#9ca3af' }}>Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold" style={{ color: '#ec4899' }}>
                      ${(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default AdminOrders