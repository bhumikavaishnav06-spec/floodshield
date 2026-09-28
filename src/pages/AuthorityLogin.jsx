import { useState } from 'react'
import { ShieldCheck, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import './AuthorityLogin.css'
import { useNavigate } from 'react-router-dom'

function AuthorityLogin() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [authorityId, setAuthorityId] = useState('')
  const [password, setPassword] = useState('')

  function handleLogin(e) {
  e.preventDefault()

  const DEMO_AUTHORITY_ID = 'DMO-DEMO'
  const DEMO_PASSWORD = '12345678'

  if (
    authorityId === DEMO_AUTHORITY_ID &&
    password === DEMO_PASSWORD
  ) {

    localStorage.setItem(
      'floodshield_authority',
      authorityId
    )

    navigate('/dashboard')

  } else {

    alert(
      'Invalid authority ID or password.'
    )

  }
}

  return (
    <div className="login-page">

      {/* Background effects */}

      <div className="login-grid"></div>

      <div className="login-glow login-glow-one"></div>
      <div className="login-glow login-glow-two"></div>


      {/* LEFT SIDE */}

      <motion.div
        className="login-brand"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >

        <div className="brand-icon">
          <ShieldCheck size={30} />
        </div>

        <h1>
          Flood<span>Shield</span>
        </h1>

        <p className="brand-tagline">
          Predict. Protect. Respond.
        </p>

        <div className="brand-description">
          <p>
            Disaster intelligence for
            <br />
            faster and smarter response.
          </p>
        </div>

        <div className="system-status">

          <span className="status-dot"></span>

          <div>
            <strong>System Operational</strong>
            <small>FloodShield Intelligence Network</small>
          </div>

        </div>

      </motion.div>


      {/* LOGIN CARD */}

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >

        <div className="login-card-header">

          <div className="secure-icon">
            <Lock size={18} />
          </div>

          <div>
            <span>AUTHORIZED ACCESS</span>
            <h2>Authority Login</h2>
          </div>

        </div>


        <p className="login-intro">
          Sign in to access the FloodShield
          disaster intelligence dashboard.
        </p>


        <form onSubmit={handleLogin}>

          {/* AUTHORITY ID */}

          <div className="input-group">

            <label>
              Authority ID
            </label>

            <div className="input-wrapper">

              <ShieldCheck size={17} />

              <input
                type="text"
                placeholder="Enter authority ID"
                value={authorityId}
                onChange={(e) =>
                  setAuthorityId(e.target.value)
                }
                required
              />

            </div>

          </div>


          {/* PASSWORD */}

          <div className="input-group">

            <div className="password-label">

              <label>
                Password
              </label>

              <button
                type="button"
                className="forgot-button"
                onClick={() =>
                  alert('Contact system administrator.')
                }
              >
                Forgot password?
              </button>

            </div>


            <div className="input-wrapper">

              <Lock size={17} />

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="eye-button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >

                {showPassword
                  ? <EyeOff size={17} />
                  : <Eye size={17} />
                }

              </button>

            </div>

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-button"
          >

            <span>
              Sign in to Command Center
            </span>

            <ArrowRight size={18} />

          </button>

        </form>


        <div className="login-security">

          <Lock size={12} />

          <span>
            Secure authority access
          </span>

        </div>

      </motion.div>

    </div>
  )
}

export default AuthorityLogin