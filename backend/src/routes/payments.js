const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const prisma = require('../middleware/prismaClient')

// create stripe checkout session
router.post('/create-checkout-session', async (req, res) => {
const { clerkId, items, shippingAddress } = req.body

if (!clerkId || !items || items.length === 0) {
return res.status(400).json({ message: 'clerkId and items are required' })
}

const user = await prisma.user.findUnique({
where: { clerkId }
})

if (!user) return res.status(404).json({ message: 'User not found' })

// save shipping address
const address = await prisma.address.create({
data: {
userId: user.id,
fullName: shippingAddress.fullName,
phoneNumber: shippingAddress.phoneNumber,
country: shippingAddress.country,
city: shippingAddress.city,
postalCode: shippingAddress.postalCode,
streetAddress: shippingAddress.streetAddress
}
})

// build stripe line items
const lineItems = items.map(item => ({
price_data: {
currency: 'usd',
product_data: {
name: item.name,
images: item.imageUrl ? [item.imageUrl] : []
},
unit_amount: Math.round(parseFloat(item.price) * 100)
},
quantity: item.quantity
}))

const session = await stripe.checkout.sessions.create({
payment_method_types: ['card'],
line_items: lineItems,
mode: 'payment',
success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `${process.env.FRONTEND_URL}/cart`,
metadata: {
clerkId,
addressId: address.id,
items: JSON.stringify(items.map(i => ({
productId: i.productId,
quantity: i.quantity,
unitPrice: i.price
})))
}
})

res.json({ url: session.url, sessionId: session.id })
})

// webhook — called by stripe after payment
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
const sig = req.headers['stripe-signature']
let event

try {
event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
} catch (err) {
return res.status(400).json({ message: `Webhook error: ${err.message}` })
}

if (event.type === 'checkout.session.completed') {
const session = event.data.object
const { clerkId, addressId, items } = session.metadata
const parsedItems = JSON.parse(items)

const user = await prisma.user.findUnique({ where: { clerkId } })

const totalAmount = parsedItems.reduce((acc, i) => acc + parseFloat(i.unitPrice) * i.quantity, 0)

const order = await prisma.order.create({
data: {
userId: user.id,
totalAmount,
status: 'PENDING',
paymentStatus: 'PAID',
stripeSessionId: session.id,
shippingAddressId: addressId,
items: {
create: parsedItems.map(i => ({
productId: i.productId,
quantity: i.quantity,
unitPrice: parseFloat(i.unitPrice)
}))
}
}
})

// reduce stock for each product
for (const item of parsedItems) {
await prisma.product.update({
where: { id: item.productId },
data: { stock: { decrement: item.quantity } }
})
}

// save payment record
await prisma.payment.create({
data: {
orderId: order.id,
stripePaymentId: session.payment_intent,
amount: totalAmount,
currency: 'usd',
status: 'PAID'
}
})

// clear cart
const cart = await prisma.cart.findUnique({ where: { userId: user.id } })
if (cart) {
await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
}
}

res.json({ received: true })
})

// verify session after redirect
router.get('/verify-session/:sessionId', async (req, res) => {
const session = await stripe.checkout.sessions.retrieve(req.params.sessionId)

if (session.payment_status === 'paid') {
const order = await prisma.order.findFirst({
where: { stripeSessionId: session.id },
include: {
items: { include: { product: true } },
shippingAddress: true
}
})
return res.json({ success: true, order })
}

res.json({ success: false })
})

module.exports = router