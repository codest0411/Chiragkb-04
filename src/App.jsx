import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './contexts/ThemeContext'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Experience from './pages/Experience'
import Contact from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

// Component to conditionally render header and footer
const Layout = ({ children }) => {
  const location = useLocation()
  const isAdminDashboard = location.pathname.includes('/admin/dashboard') || location.pathname === '/admin'
  const isAdminLogin = location.pathname === '/admin/login'
  
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
      {!isAdminDashboard && <Header />}
      <main className={isAdminDashboard ? '' : 'pt-16'}>
        {children}
      </main>
      {!isAdminDashboard && !isAdminLogin && <Footer />}
    </div>
  )
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router future={{ 
          v7_startTransition: true,
          v7_relativeSplatPath: true 
        }}>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App
