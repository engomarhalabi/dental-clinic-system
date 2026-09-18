import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'

export default function Login() {
  const { login } = useAuth()
  const { t, lang, setLang } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(t('login_error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="login-mark">🦷</div>
          <div className="lang-switch">
            <button className={lang === 'ar' ? 'active' : ''} onClick={() => setLang('ar')} type="button">
              AR
            </button>
            <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')} type="button">
              EN
            </button>
          </div>
        </div>

        <h1>{t('login_title')}</h1>
        <p className="subtitle">{t('login_subtitle')}</p>

        {error && <div className="form-error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">{t('email')}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="field">
            <label htmlFor="password">{t('password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? t('login_loading') : t('login_button')}
          </button>
        </form>
      </div>
    </div>
  )
}
