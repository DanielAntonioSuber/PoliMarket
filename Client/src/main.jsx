import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { UserProvider } from './context/UserContext' // 👈

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <UserProvider> {/* 👈 Envolver aquí */}
      <CartProvider>
        <App />
      </CartProvider>
    </UserProvider>
  </BrowserRouter>
)