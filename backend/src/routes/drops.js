const express = require('express')
const { getAuth } = require('@clerk/express')  // ✅ ADD THIS
const router = express.Router()
const prisma = require('../middleware/prismaClient')

const calculateStatus = (releaseDate, endDate) => {
  const now = new Date()
  const release = new Date(releaseDate)
  const end = new Date(endDate)
  if (now < release) return 'UPCOMING'
  if (now >= release && now <= end) return 'LIVE'
  return 'ENDED'
}

router.get('/', async (req, res) => {
  const drops = await prisma.drop.findMany({
    where: { isReady: true },
    include: {
      seller: { select: { firstName: true, lastName: true, profileImage: true } },
      products: true
    },
    orderBy: { releaseDate: 'asc' }
  })
  const updated = await Promise.all(drops.map(async drop => {
    const newStatus = calculateStatus(drop.releaseDate, drop.endDate)
    if (newStatus !== drop.status) {
      return await prisma.drop.update({
        where: { id: drop.id },
        data: { status: newStatus },
        include: {
          seller: { select: { firstName: true, lastName: true, profileImage: true } },
          products: true
        }
      })
    }
    return drop
  }))
  res.json(updated)
})

router.get('/id/:id', async (req, res) => {
  const drop = await prisma.drop.findUnique({
    where: { id: req.params.id },
    include: {
      seller: { select: { firstName: true, lastName: true } },
      products: true
    }
  })
  if (!drop) return res.status(404).json({ message: 'Drop not found' })
  res.json(drop)
})

router.get('/seller/:clerkId', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { clerkId: req.params.clerkId }
  })
  if (!user) return res.status(404).json({ message: 'Seller not found' })
  const drops = await prisma.drop.findMany({
    where: { sellerId: user.id },
    include: { products: true },
    orderBy: { createdAt: 'desc' }
  })
  res.json(drops)
})

router.get('/:slug', async (req, res) => {
  const drop = await prisma.drop.findUnique({
    where: { slug: req.params.slug },
    include: {
      seller: { select: { firstName: true, lastName: true, profileImage: true } },
      products: { where: { isActive: true } }
    }
  })
  if (!drop) return res.status(404).json({ message: 'Drop not found' })
  const newStatus = calculateStatus(drop.releaseDate, drop.endDate)
  if (newStatus !== drop.status) {
    const updated = await prisma.drop.update({
      where: { id: drop.id },
      data: { status: newStatus },
      include: {
        seller: { select: { firstName: true, lastName: true, profileImage: true } },
        products: { where: { isActive: true } }
      }
    })
    return res.json(updated)
  }
  res.json(drop)
})

router.post('/', async (req, res) => {
    try {  // ✅ ADD THIS
  const { userId: clerkId } = getAuth(req)  
  const { title, description, coverImage, releaseDate, endDate } = req.body
  
 
  if (!title || !description || !releaseDate || !endDate || !clerkId) {
    return res.status(400).json({ message: 'title, description, releaseDate, endDate and authentication are required' })
  }
  
  if (new Date(endDate) <= new Date(releaseDate)) {
    return res.status(400).json({ message: 'End date must be after release date' })
  }
  
  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) return res.status(404).json({ message: 'User not found' })
  
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now()
  const status = calculateStatus(releaseDate, endDate)
  
  const drop = await prisma.drop.create({
    data: {
      title, slug, description,
      coverImage: coverImage || '',
      releaseDate: new Date(releaseDate),
      endDate: new Date(endDate),
      status, isReady: false,
      sellerId: user.id
    }
  })
  res.status(201).json(drop)
   } catch (err) {  
    console.error('❌ Drop creation error:', err.message)
    res.status(400).json({ error: err.message })
  } 
})

router.put('/:id', async (req, res) => {
  const { title, description, coverImage, releaseDate, endDate } = req.body
  const status = calculateStatus(releaseDate, endDate)
  const drop = await prisma.drop.update({
    where: { id: req.params.id },
    data: { title, description, coverImage, releaseDate: new Date(releaseDate), endDate: new Date(endDate), status }
  })
  res.json(drop)
})

router.patch('/:id/publish', async (req, res) => {
  const drop = await prisma.drop.findUnique({
    where: { id: req.params.id },
    include: { products: true }
  })
  if (!drop) return res.status(404).json({ message: 'Drop not found' })
  if (drop.products.length === 0) {
    return res.status(400).json({ message: 'Add at least one product before publishing' })
  }
  const updated = await prisma.drop.update({
    where: { id: req.params.id },
    data: { isReady: true }
  })
  res.json(updated)
})

router.patch('/:id/unpublish', async (req, res) => {
  const updated = await prisma.drop.update({
    where: { id: req.params.id },
    data: { isReady: false }
  })
  res.json(updated)
})

router.patch('/:id/add-product', async (req, res) => {
  const { productId } = req.body
  const product = await prisma.product.update({
    where: { id: productId },
    data: { dropId: req.params.id }
  })
  res.json(product)
})

router.patch('/:id/remove-product', async (req, res) => {
  const { productId } = req.body
  const product = await prisma.product.update({
    where: { id: productId },
    data: { dropId: null }
  })
  res.json(product)
})

router.put('/:id/publish', async (req, res) => {
  const drop = await prisma.drop.findUnique({
    where: { id: req.params.id },
    include: { products: true }
  })
  if (!drop) return res.status(404).json({ message: 'Drop not found' })
  if (drop.products.length === 0) {
    return res.status(400).json({ message: 'Add at least one product before publishing' })
  }
  const updated = await prisma.drop.update({
    where: { id: req.params.id },
    data: { isReady: true }
  })
  res.json(updated)
})

router.put('/:id/unpublish', async (req, res) => {
  const updated = await prisma.drop.update({
    where: { id: req.params.id },
    data: { isReady: false }
  })
  res.json(updated)
})

router.put('/:id/check-status', async (req, res) => {
  const drop = await prisma.drop.findUnique({ where: { id: req.params.id } })
  if (!drop) return res.status(404).json({ message: 'Drop not found' })
  const newStatus = calculateStatus(drop.releaseDate, drop.endDate)
  if (newStatus !== drop.status) {
    const updated = await prisma.drop.update({
      where: { id: req.params.id },
      data: { status: newStatus },
      include: {
        seller: { select: { firstName: true, lastName: true, profileImage: true } },
        products: { where: { isActive: true } }
      }
    })
    return res.json({ updated: true, drop: updated })
  }
  res.json({ updated: false, drop })
})

router.delete('/:id', async (req, res) => {
  await prisma.drop.delete({ where: { id: req.params.id } })
  res.json({ message: 'Drop deleted' })
})

module.exports = router