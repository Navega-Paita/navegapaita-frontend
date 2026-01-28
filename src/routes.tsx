import { Routes, Route } from 'react-router-dom'
import HomePage from './features/home/HomePage'
import AboutPage from './features/about/AboutPage'
import PackagesPage from './features/packages/PackagesPage'
import ContactPage from './features/contact/ContactPage'
import WishlistPage from './features/wishlist/WishlistPage'

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sobre-paita" element={<AboutPage />} />
            <Route path="/destinos" element={<PackagesPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/perfil" element={<HomePage />} /> {/* Temporal */}
            <Route path="/sobre-nosotros" element={<AboutPage />} /> {/* Para footer */}
        </Routes>
    )
}