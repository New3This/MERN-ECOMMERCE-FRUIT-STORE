import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {  ProductsContextProvider } from "./context/productContext.jsx"
import { AuthenticateProvider } from './context/authenticateContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthenticateProvider>
      <ProductsContextProvider>
        <App />
      </ProductsContextProvider>
    </AuthenticateProvider>
  </StrictMode>,
)
