import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/manrope/wght.css'
import App from './App'
import ScrollToTop from './components/ScrollToTop'
import AppBootstrap from './components/AppBootstrap'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { EditModeProvider } from './contexts/EditModeContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <EditModeProvider>
            <AppBootstrap />
            <ScrollToTop />
            <App />
          </EditModeProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
