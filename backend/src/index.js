require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
require('express-async-errors')

const userRoutes = require('./routes/users')
const dropRoutes = require('./routes/drops')
const productRoutes = require('./routes/products')
const cartRoutes = require('./routes/cart')
const orderRoutes = require('./routes/orders')
const paymentRoutes = require('./routes/payments')
const adminRoutes = require('./routes/admin')
const uploadRoutes = require('./routes/upload')

const app = express()

app.use(cors({
origin: process.env.FRONTEND_URL,
credentials: true
}))

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))
app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/drops', dropRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/', (req, res) => {
res.json({ message: 'DropHouse API is running' })
})

app.use((err, req, res, next) => {
console.error(err)
res.status(500).json({ message: err.message || 'Something went wrong' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
console.log(`DropHouse backend running on port ${PORT}`)
})