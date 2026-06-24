const express = require('express')
const { getAuth } = require('@clerk/express')  // ✅ ADD THIS
const { PrismaClient } = require('@prisma/client')
const router = express.Router()
const prisma = new PrismaClient()

// GET /api/products — public, all active products
router.get('/', async (req, res) => {
try {
const { sellerId } = req.query

let products

if (sellerId) {
// get products belonging to this seller's drops + standalone products
const userDrops = await prisma.drop.findMany({
where: { sellerId },
select: { id: true }
})
const dropIds = userDrops.map(d => d.id)

products = await prisma.product.findMany({
where: {
OR: [
{ dropId: { in: dropIds } },
{ dropId: null }
]
},
include: {
drop: { select: { id: true, title: true, slug: true, status: true } },
variants: true
},
orderBy: { createdAt: 'desc' }
})
} else {
products = await prisma.product.findMany({
where: { isActive: true },
include: {
drop: { select: { title: true, slug: true, status: true } },
variants: true
},
orderBy: { createdAt: 'desc' }
})
}

res.json(products)
} catch (err) {
console.error(err)
res.status(500).json({ error: 'Failed to fetch products' })
}
})

// GET /api/products/seller — seller's own products
router.get('/seller', async (req, res) => {
  try {
    const { userId: clerkId } = getAuth(req)  // ✅ USE getAuth()

    if (!clerkId) {
      return res.status(401).json({ 
        error: 'Not authenticated. Please log in.'
      })
    }

    const user = await prisma.user.findUnique({ where: { clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const products = await prisma.product.findMany({
      where: { sellerId: user.id },
      include: {
        drop: { select: { id: true, title: true, slug: true } },
        variants: true
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(products)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { variants: true, drop: true }
    })
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// POST /api/products — seller creates a product
router.post('/', async (req, res) => {
  try {
    const { userId: clerkId } = getAuth(req)  // ✅ USE getAuth()

    if (!clerkId) {
      return res.status(401).json({ 
        error: 'Not authenticated. Please log in first.'
      })
    }

    const user = await prisma.user.findUnique({ where: { clerkId } })
    if (!user) {
      return res.status(404).json({ error: 'User not found in database' })
    }

    const {
      name, description, price, stock,
      imageUrl, category, sku, dropId, variants
    } = req.body

    if (!name || !description || !price || !stock || !imageUrl) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        imageUrl,
        category: category || null,
        sku: sku || null,
        dropId: dropId || null,
        sellerId: user.id,
        isActive: true,
        variants: variants ? {
          create: variants.map(v => ({
            size: v.size || null,
            color: v.color || null,
            stock: parseInt(v.stock)
          }))
        } : undefined
      },
      include: { variants: true }
    })

    res.status(201).json(product)
  } catch (err) {
    console.error('Error creating product:', err)
    res.status(500).json({ error: err.message || 'Failed to create product' })
  }
})

// PATCH /api/products/:id — update product
router.patch('/:id', async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl, category, isActive } = req.body
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(imageUrl && { imageUrl }),
        ...(category !== undefined && { category }),
        ...(isActive !== undefined && { isActive })
      }
    })
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' })
  }
})

module.exports = router