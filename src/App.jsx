import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import AuthorityLogin from './pages/AuthorityLogin'
import Dashboard from './pages/Dashboard'

import './App.css'


function ProtectedRoute({ children }) {

  const authority =
    localStorage.getItem('floodshield_authority')

  if (!authority) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  return children
}


function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<AuthorityLogin />}
        />


        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />


        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  )
}


export default App