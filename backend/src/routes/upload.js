const express = require('express')
const { PrismaClient } = require('@prisma/client')
const router = express.Router()
const prisma = new PrismaClient()

// helper: compute what status a drop should have right now
function computeStatus(releaseDate, endDate) {
const now = new Date()
if (now < new Date(releaseDate)) return 'UPCOMING'
if (now > new Date(endDate)) return 'ENDED'
return 'LIVE'
}

// GET /api/drops — public, only shows ready drops
router.get('/', async (req, res) => {
try {
const drops = await prisma.drop.findMany({
where: { isReady: true },
include: {
products: true,
seller: { select: { firstName: true, lastName: true } }
},
orderBy: { releaseDate: 'asc' }
})

// update status in real time before sending
const updated = drops.map(d => ({
...d,
status: computeStatus(d.releaseDate, d.endDate)
}))

res.json(updated)
} catch (err) {
console.error(err)
res.status(500).json({ error: 'Failed to fetch drops' })
}
})

// GET /api/drops/seller — seller sees all their own drops
router.get('/seller', async (req, res) => {
try {
const clerkId = req.auth?.userId

const user = await prisma.user.findUnique({ where: { clerkId } })
if (!user) return res.status(404).json({ error: 'User not found' })

const drops = await prisma.drop.findMany({
where: { sellerId: user.id },
include: { products: true },
orderBy: { createdAt: 'desc' }
})

const updated = drops.map(d => ({
...d,
status: computeStatus(d.releaseDate, d.endDate)
}))

res.json(updated)
} catch (err) {
console.error(err)
res.status(500).json({ error: 'Failed to fetch seller drops' })
}
})

// GET /api/drops/:slug — single drop detail
router.get('/:slug', async (req, res) => {
try {
const drop = await prisma.drop.findUnique({
where: { slug: req.params.slug },
include: {
products: { include: { variants: true } },
seller: { select: { firstName: true, lastName: true } }
}
})
if (!drop) return res.status(404).json({ error: 'Drop not found' })
res.json({ ...drop, status: computeStatus(drop.releaseDate, drop.endDate) })
} catch (err) {
res.status(500).json({ error: 'Failed to fetch drop' })
}
})

// POST /api/drops — seller creates a drop
router.post('/', async (req, res) => {
try {
const clerkId = req.auth?.userId


const user = await prisma.user.findUnique({ where: { clerkId } })
if (!user) return res.status(404).json({ error: 'User not found' })

const { title, description, coverImage, releaseDate, endDate } = req.body
if (!title || !description || !coverImage || !releaseDate || !endDate) {
return res.status(400).json({ error: 'Missing required fields' })
}

// build a slug from title
const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now()

const drop = await prisma.drop.create({
data: {
title,
slug,
description,
coverImage,
releaseDate: new Date(releaseDate),
endDate: new Date(endDate),
sellerId: user.id,
isReady: false,
status: 'UPCOMING'
}
})

res.status(201).json(drop)
} catch (err) {
console.error(err)
res.status(500).json({ error: 'Failed to create drop' })
}
})

// PATCH /api/drops/:id/add-product — add an existing product to a drop
router.patch('/:id/add-product', async (req, res) => {
try {
const clerkId = req.auth?.userId


const user = await prisma.user.findUnique({ where: { clerkId } })
const drop = await prisma.drop.findUnique({ where: { id: req.params.id } })

if (!drop || drop.sellerId !== user.id) {
return res.status(403).json({ error: 'Not allowed' })
}

const { productId } = req.body
await prisma.product.update({
where: { id: productId },
data: { dropId: req.params.id }
})

res.json({ message: 'Product added to drop' })
} catch (err) {
res.status(500).json({ error: 'Failed to add product to drop' })
}
})

// PATCH /api/drops/:id/remove-product — remove product from a drop
router.patch('/:id/remove-product', async (req, res) => {
try {
const clerkId = req.auth?.userId


const user = await prisma.user.findUnique({ where: { clerkId } })
const drop = await prisma.drop.findUnique({ where: { id: req.params.id } })

if (!drop || drop.sellerId !== user.id) {
return res.status(403).json({ error: 'Not allowed' })
}

const { productId } = req.body
await prisma.product.update({
where: { id: productId },
data: { dropId: null }
})

res.json({ message: 'Product removed from drop' })
} catch (err) {
res.status(500).json({ error: 'Failed to remove product from drop' })
}
})

// PATCH /api/drops/:id/publish — seller marks drop as ready to launch
router.patch('/:id/publish', async (req, res) => {
try {
const clerkId = req.auth?.userId


const user = await prisma.user.findUnique({ where: { clerkId } })
const drop = await prisma.drop.findUnique({
where: { id: req.params.id },
include: { products: true }
})

if (!drop || drop.sellerId !== user.id) {
return res.status(403).json({ error: 'Not allowed' })
}

if (drop.products.length === 0) {
return res.status(400).json({ error: 'Add at least one product before publishing' })
}

const updated = await prisma.drop.update({
where: { id: req.params.id },
data: { isReady: true }
})

res.json(updated)
} catch (err) {
res.status(500).json({ error: 'Failed to publish drop' })
}
})

// DELETE /api/drops/:id
router.delete('/:id', async (req, res) => {
try {
const clerkId = req.auth?.userId


const user = await prisma.user.findUnique({ where: { clerkId } })
const drop = await prisma.drop.findUnique({ where: { id: req.params.id } })

if (!drop || drop.sellerId !== user.id) {
return res.status(403).json({ error: 'Not allowed' })
}

await prisma.drop.delete({ where: { id: req.params.id } })
res.json({ message: 'Drop deleted' })
} catch (err) {
res.status(500).json({ error: 'Failed to delete drop' })
}
})

module.exports = router