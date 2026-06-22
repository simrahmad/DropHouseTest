const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadDir)) {
fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, uploadDir)
},
filename: function (req, file, cb) {
const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9)
const ext = path.extname(file.originalname)
cb(null, uniqueName + ext)
}
})

const fileFilter = (req, file, cb) => {
const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
if (allowed.includes(file.mimetype)) {
cb(null, true)
} else {
cb(new Error('Only image files are allowed'), false)
}
}

const upload = multer({
storage,
fileFilter,
limits: { fileSize: 5 * 1024 * 1024 }
})

router.post('/', upload.single('image'), (req, res) => {
if (!req.file) {
return res.status(400).json({ message: 'No file uploaded' })
}

const imageUrl = `/uploads/${req.file.filename}`
res.json({ imageUrl, message: 'Image uploaded successfully' })
})

module.exports = router