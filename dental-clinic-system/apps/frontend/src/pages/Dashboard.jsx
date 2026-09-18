import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dashboardApi, patientsApi } from '../services/api'
import { useLanguage } from '../contexts/LanguageContext'

export default function Dashboard() {
  const { t, lang } = useLanguage()
  const [stats, setStats] = useState(null)
  const [recentPatients, setRecentPatients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const [statsRes, patientsRes] = await Promise.all([
          dashboardApi.stats().catch(() => ({ data: null })),
          patientsApi.list({ page: 1, pageSize: 5, sort: '-createdAt' }).catch(() => ({ data: { items: [] } })),
        ])
        if (cancelled) return
        setStats(statsRes.data)
        setRecentPatients(patientsRes.data?.items || [])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const cards = [
    { key: 'stat_total_patients', value: stats?.totalPatients },
    { key: 'stat_today_appointments', value: stats?.todayAppointments },
    { key: 'stat_open_invoices', value: stats?.openInvoices },
    { key: 'stat_active_chairs', value: stats?.activeChairs },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>{t('dashboard_title')}</h2>
          <p>{t('dashboard_subtitle')}</p>
        </div>
      </div>

      <div className="stat-grid">
        {cards.map((card) => (
          <div className="card stat-card" key={card.key}>
            <div className="stat-label">{t(card.key)}</div>
            <div className="stat-value">{loading ? '—' : card.value ?? 0}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-pad" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 15 }}>{t('recent_patients')}</h3>
          <Link to="/patients" className="btn btn-ghost">
            {t('view_all')}
          </Link>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('col_name')}</th>
                <th>{t('col_phone')}</th>
                <th>{t('col_last_visit')}</th>
              </tr>
            </thead>
            <tbody>
              {recentPatients.map((p) => (
                <tr key={p.id} className="clickable" onClick={() => (window.location.href = `/patients/${p.id}`)}>
                  <td>{p.fullName}</td>
                  <td>{p.phone}</td>
                  <td>
                    {p.lastVisit
                      ? new Date(p.lastVisit).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB')
                      : '—'}
                  </td>
                </tr>
              ))}
              {!loading && recentPatients.length === 0 && (
                <tr>
                  <td colSpan={3}>
                    <div className="empty-state">{t('no_patients')}</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
