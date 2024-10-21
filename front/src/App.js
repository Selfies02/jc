import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AuthProvider } from './actions/authContext'
import { Toaster } from 'react-hot-toast'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

const Login = React.lazy(() => import('./views/login/Login'))
const ForgotPassword = React.lazy(() => import('./views/forgotPassword/ForgorPassword.js'))
const ResetPassword = React.lazy(() => import('./views/resetPassword/ResetPassword.js'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

import PrivateRoute from './PrivateRoute'
import VerifySuccess from './views/emailVerify/VerifySuccess.js'
import VerifyFailed from './views/emailVerify/VerifyFailed.js'

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, [])

  return (
    <>
      <Toaster />
      <AuthProvider>
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="pt-3 text-center">
                <CSpinner color="primary" variant="grow" />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" name="Login Page" element={<Login />} />
              <Route path="/register" name="Register Page" element={<Register />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route path="/resetPassword/:token" element={<ResetPassword />} />
              <Route path="/verify-success" element={<VerifySuccess />} />
              <Route path="/verify-failed" element={<VerifyFailed />} />
              <Route path="/404" name="Page 404" element={<Page404 />} />
              <Route path="/500" name="Page 500" element={<Page500 />} />
              <Route
                path="*"
                name="Home"
                element={
                  <PrivateRoute>
                    <DefaultLayout />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
