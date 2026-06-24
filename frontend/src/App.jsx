import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import DropsPage from './pages/DropsPage'
import ProductsPage from './pages/ProductsPage'
import DropDetailPage from './pages/DropDetailPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import MyOrdersPage from './pages/MyOrdersPage'
import SellerDashboard from './pages/seller/SellerDashboard'
import CreateDrop from './pages/seller/CreateDrop'
import AddProduct from './pages/seller/AddProduct'
import ManageDrop from './pages/seller/ManageDrop'
import SellerOrders from './pages/seller/SellerOrders'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminDrops from './pages/admin/AdminDrops'
import AdminOrders from './pages/admin/AdminOrders'
import ProtectedRoute from './components/ProtectedRoute'
import SellerRoute from './components/SellerRoute'
import AdminRoute from './components/AdminRoute'
import useSyncUser from './hooks/useSyncUser'

function AppInner() {
useSyncUser()

return (
<Routes>
<Route path="/login" element={<LoginPage />} />
<Route path="/signup" element={<SignupPage />} />
<Route path="/" element={<HomePage />} />
<Route path="/drops" element={<DropsPage />} />
<Route path="/drops/:slug" element={<DropDetailPage />} />
<Route path="/products/:id" element={<ProductDetailPage />} />

<Route path="/cart" element={
<ProtectedRoute><CartPage /></ProtectedRoute>
} />
<Route path="/checkout" element={
<ProtectedRoute><CheckoutPage /></ProtectedRoute>
} />

<Route path="/products" element={<ProductsPage />} />

<Route path="/order-success" element={
<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>
} />
<Route path="/my-orders" element={
<ProtectedRoute><MyOrdersPage /></ProtectedRoute>
} />

<Route path="/seller/dashboard" element={
<ProtectedRoute><SellerRoute><SellerDashboard /></SellerRoute></ProtectedRoute>
} />
<Route path="/seller/create-drop" element={
<ProtectedRoute><SellerRoute><CreateDrop /></SellerRoute></ProtectedRoute>
} />
<Route path="/seller/add-product/:dropId" element={
<ProtectedRoute><SellerRoute><AddProduct /></SellerRoute></ProtectedRoute>
} />
<Route path="/seller/manage/:dropId" element={
<ProtectedRoute><SellerRoute><ManageDrop /></SellerRoute></ProtectedRoute>
} />
<Route path="/seller/orders" element={
<ProtectedRoute><SellerRoute><SellerOrders /></SellerRoute></ProtectedRoute>
} />

<Route path="/admin" element={
<ProtectedRoute><AdminRoute><AdminDashboard /></AdminRoute></ProtectedRoute>
} />
<Route path="/admin/users" element={
<ProtectedRoute><AdminRoute><AdminUsers /></AdminRoute></ProtectedRoute>
} />
<Route path="/admin/drops" element={
<ProtectedRoute><AdminRoute><AdminDrops /></AdminRoute></ProtectedRoute>
} />
<Route path="/admin/orders" element={
<ProtectedRoute><AdminRoute><AdminOrders /></AdminRoute></ProtectedRoute>
} />

<Route path="*" element={<Navigate to="/" />} />
</Routes>
)
}

function App() {
return (
<BrowserRouter>
<AppInner />
</BrowserRouter>
)
}

export default App