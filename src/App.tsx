import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ShopMen from './pages/ShopMen'
import ShopWomen from './pages/ShopWomen'
import ShopChildren from './pages/ShopChildren'
import ShopAccessories from './pages/ShopAccessories'
import ShopBrand from './pages/ShopBrand'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import ShippingReturns from './pages/ShippingReturns'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import OrderConfirmation from './pages/OrderConfirmation'
import OrderTracking from './pages/OrderTracking'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop/men" element={<ShopMen />} />
        <Route path="/shop/women" element={<ShopWomen />} />
        <Route path="/shop/children" element={<ShopChildren />} />
        <Route path="/shop/accessories" element={<ShopAccessories />} />
        <Route path="/brand/:brandName" element={<ShopBrand />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/shipping-returns" element={<ShippingReturns />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/track-order" element={<OrderTracking />} />
      </Route>
    </Routes>
  )
}
