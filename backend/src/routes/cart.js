const express = require('express')
const router = express.Router()
const prisma = require('../middleware/prismaClient')

// get cart for a user
router.get('/:clerkId', async (req, res) => {
const user = await prisma.user.findUnique({
where: { clerkId: req.params.clerkId }
})

if (!user) return res.status(404).json({ message: 'User not found' })

let cart = await prisma.cart.findUnique({
where: { userId: user.id },
include: {
items: {
include: {
product: true
}
}
}
})

if (!cart) {
cart = await prisma.cart.create({
data: { userId: user.id },
include: {
items: {
include: { product: true }
}
}
})
}

res.json(cart)
})

// add item to cart
router.post('/add', async (req, res) => {
const { clerkId, productId, quantity } = req.body

const user = await prisma.user.findUnique({
where: { clerkId }
})

if (!user) return res.status(404).json({ message: 'User not found' })

let cart = await prisma.cart.findUnique({
where: { userId: user.id }
})

if (!cart) {
cart = await prisma.cart.create({
data: { userId: user.id }
})
}

const existing = await prisma.cartItem.findFirst({
where: { cartId: cart.id, productId }
})

if (existing) {
await prisma.cartItem.update({
where: { id: existing.id },
data: { quantity: existing.quantity + quantity }
})
} else {
await prisma.cartItem.create({
data: { cartId: cart.id, productId, quantity }
})
}

const updated = await prisma.cart.findUnique({
where: { id: cart.id },
include: { items: { include: { product: true } } }
})

res.json(updated)
})

// update item quantity
router.put('/item/:itemId', async (req, res) => {
const { quantity } = req.body

if (quantity <= 0) {
await prisma.cartItem.delete({ where: { id: req.params.itemId } })
return res.json({ message: 'Item removed' })
}

const item = await prisma.cartItem.update({
where: { id: req.params.itemId },
data: { quantity }
})

res.json(item)
})

// remove item from cart
router.delete('/item/:itemId', async (req, res) => {
await prisma.cartItem.delete({ where: { id: req.params.itemId } })
res.json({ message: 'Item removed' })
})

// clear cart
router.delete('/clear/:clerkId', async (req, res) => {
const user = await prisma.user.findUnique({
where: { clerkId: req.params.clerkId }
})

if (!user) return res.status(404).json({ message: 'User not found' })

const cart = await prisma.cart.findUnique({ where: { userId: user.id } })

if (cart) {
await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
}

res.json({ message: 'Cart cleared' })
})

module.exports = router