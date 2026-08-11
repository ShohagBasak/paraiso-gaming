import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { router } from './routes/routes'
import AuthProvider from './context/AuthProvider'
import { UcpProvider } from './context/UcpContext'
import ErrorBoundary from './components/ErrorBoundary'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <UcpProvider>
          <RouterProvider router={router} />
        </UcpProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
)
