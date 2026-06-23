const express = require('express')
const { PrismaClient } = require('@prisma/client')
const router = express.Router()
const prisma = new PrismaClient()

// middleware: check admin role
async function requireAdmin(req, res, next) {
try {
const clerkId = req.auth?.userId


const user = await prisma.user.findUnique({ where: { clerkId } })
if (!user || user.role !== 'ADMIN') {
return res.status(403).json({ error: 'Forbidden' })
}
req.adminUser = user
next()
} catch (err) {
res.status(500).json({ error: 'Auth check failed' })
}
}

// GET /api/admin/stats — overall dashboard numbers
router.get('/stats', requireAdmin, async (req, res) => {
try {
const [
totalUsers,
totalOrders,
totalRevenue,
totalProducts,
totalDrops,
soldItems
] = await Promise.all([
prisma.user.count(),
prisma.order.count(),
prisma.order.aggregate({
_sum: { totalAmount: true },
where: { paymentStatus: 'PAID' }
}),
prisma.product.count(),
prisma.drop.count(),
prisma.orderItem.aggregate({
_sum: { quantity: true },
where: { order: { paymentStatus: 'PAID' } }
})
])

res.json({
totalUsers,
totalOrders,
totalRevenue: totalRevenue._sum.totalAmount || 0,
totalProducts,
totalDrops,
soldItems: soldItems._sum.quantity || 0
})
} catch (err) {
console.error(err)
res.status(500).json({ error: 'Failed to fetch stats' })
}
})

// GET /api/admin/sold-items — detailed list of sold items
router.get('/sold-items', requireAdmin, async (req, res) => {
try {
const items = await prisma.orderItem.findMany({
where: { order: { paymentStatus: 'PAID' } },
include: {
product: {
select: { name: true, imageUrl: true, price: true, category: true }
},
order: {
select: {
id: true,
createdAt: true,
status: true,
user: { select: { firstName: true, lastName: true, email: true } }
}
}
},
orderBy: { order: { createdAt: 'desc' } }
})

res.json(items)
} catch (err) {
console.error(err)
res.status(500).json({ error: 'Failed to fetch sold items' })
}
})

// GET /api/admin/orders — all orders with user + items
router.get('/orders', requireAdmin, async (req, res) => {
try {
const orders = await prisma.order.findMany({
include: {
user: { select: { firstName: true, lastName: true, email: true } },
items: {
include: {
product: { select: { name: true, imageUrl: true } }
}
},
shippingAddress: true
},
orderBy: { createdAt: 'desc' }
})
res.json(orders)
} catch (err) {
res.status(500).json({ error: 'Failed to fetch orders' })
}
})

// GET /api/admin/users
router.get('/users', requireAdmin, async (req, res) => {
try {
const users = await prisma.user.findMany({
include: {
_count: { select: { orders: true, drops: true } }
},
orderBy: { createdAt: 'desc' }
})
res.json(users)
} catch (err) {
res.status(500).json({ error: 'Failed to fetch users' })
}
})

// PATCH /api/admin/users/:id/role
router.patch('/users/:id/role', requireAdmin, async (req, res) => {
try {
const { role } = req.body
const user = await prisma.user.update({
where: { id: req.params.id },
data: { role }
})
res.json(user)
} catch (err) {
res.status(500).json({ error: 'Failed to update role' })
}
})

module.exports = router