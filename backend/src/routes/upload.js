const express = require('express')
const { getAuth } = require('@clerk/express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const prisma = require('../middleware/prismaClient')

const router = express.Router()

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads')  // ✅ FIXED PATH: goes to backend/uploads
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)  // ✅ Use the uploads directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },  // 10MB max
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only images allowed.'))
    }
  }
})

// POST /api/upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { userId: clerkId } = getAuth(req)

    console.log('📤 Image upload - clerkId:', clerkId)

    if (!clerkId) {
      return res.status(401).json({ 
        error: 'Not authenticated. Please log in.' 
      })
    }

    // Find user by clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId }
    })

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found in database.' 
      })
    }

    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file uploaded' 
      })
    }

    const imageUrl = `/uploads/${req.file.filename}`

    console.log('✅ Image uploaded:', imageUrl)

    res.json({
      success: true,
      imageUrl,
      filename: req.file.filename,
      message: 'Image uploaded successfully'
    })

  } catch (error) {
    console.error('❌ Upload error:', error)
    res.status(500).json({ 
      error: error.message || 'Upload failed'
    })
  }
})

module.exports = router