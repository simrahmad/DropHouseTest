const express = require('express')
const router = express.Router()
const prisma = require('../middleware/prismaClient')

// get orders for a customer
router.get('/my/:clerkId', async (req, res) => {
const user = await prisma.user.findUnique({
where: { clerkId: req.params.clerkId }
})

if (!user) return res.status(404).json({ message: 'User not found' })

const orders = await prisma.order.findMany({
where: { userId: user.id },
include: {
items: { include: { product: true } },
shippingAddress: true,
payment: true
},
orderBy: { createdAt: 'desc' }
})

res.json(orders)
})

// get orders for a seller
router.get('/seller/:clerkId', async (req, res) => {
const user = await prisma.user.findUnique({
where: { clerkId: req.params.clerkId }
})

if (!user) return res.status(404).json({ message: 'User not found' })

const drops = await prisma.drop.findMany({
where: { sellerId: user.id },
select: { id: true }
})

const dropIds = drops.map(d => d.id)

const orders = await prisma.order.findMany({
where: {
items: {
some: {
product: { dropId: { in: dropIds } }
}
}
},
include: {
items: { include: { product: true } },
shippingAddress: true,
user: { select: { firstName: true, lastName: true, email: true } }
},
orderBy: { createdAt: 'desc' }
})

res.json(orders)
})

// update order status
router.put('/:id/status', async (req, res) => {
const { status } = req.body

const order = await prisma.order.update({
where: { id: req.params.id },
data: { status }
})

res.json(order)
})

module.exports = router