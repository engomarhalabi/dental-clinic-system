import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'

const NAV_ITEMS = [
  { to: '/', key: 'nav_dashboard', icon: '▦', end: true },
  { to: '/patients', key: 'nav_patients', icon: '⚕', end: false },
]

function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export default function Layout() {
  const { user, logout } = useAuth()
  const { t, lang, setLang } = useLanguage()
  const navigate = useNavigate()

  const roleLabel = user?.role ? t(`role_${user.role}`) : ''

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark">🦷</div>
          <div className="sidebar-brand-text">
            <strong>{t('appName')}</strong>
            <span>{t('appNameSub')}</span>
          </div>
        </div>

        <ul className="nav-list">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
              >
                <span className="nav-icon">{item.icon}</span>
                {t(item.key)}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="user-avatar">{initials(user?.name)}</div>
            <div className="user-meta">
              <strong>{user?.name}</strong>
              <span>{roleLabel}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            {t('logout')}
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <h1>{t('appName')}</h1>
          <div className="lang-switch">
            <button className={lang === 'ar' ? 'active' : ''} onClick={() => setLang('ar')}>
              العربية
            </button>
            <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>
              English
            </button>
          </div>
        </header>
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
