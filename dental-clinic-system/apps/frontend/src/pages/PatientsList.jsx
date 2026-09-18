import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { patientsApi } from '../services/api'
import { useLanguage } from '../contexts/LanguageContext'

const PAGE_SIZE = 10

function calcAge(dob) {
  if (!dob) return '—'
  const diff = Date.now() - new Date(dob).getTime()
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
}

export default function PatientsList() {
  const { t, lang } = useLanguage()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [patients, setPatients] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  // Debounce the search box so we don't hit the API on every keystroke.
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 350)
    return () => clearTimeout(id)
  }, [search])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await patientsApi.list({ search: debouncedSearch, page, pageSize: PAGE_SIZE })
      setPatients(res.data?.items || [])
      setTotal(res.data?.total ?? (res.data?.items || []).length)
    } catch {
      setPatients([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, page])

  useEffect(() => {
    load()
  }, [load])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>{t('patients_title')}</h2>
          <p>{t('patients_subtitle')}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/patients/new')}>
          + {t('add_patient')}
        </button>
      </div>

      <div className="search-row">
        <input
          type="text"
          placeholder={t('search_placeholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('col_name')}</th>
                <th>{t('col_phone')}</th>
                <th>{t('col_age')}</th>
                <th>{t('col_last_visit')}</th>
                <th>{t('col_status')}</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} className="clickable" onClick={() => navigate(`/patients/${p.id}`)}>
                  <td>{p.fullName}</td>
                  <td>{p.phone}</td>
                  <td>{calcAge(p.dob)}</td>
                  <td>
                    {p.lastVisit
                      ? new Date(p.lastVisit).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB')
                      : '—'}
                  </td>
                  <td>
                    <span className={`badge ${p.lastVisit ? 'badge-success' : 'badge-muted'}`}>
                      {p.lastVisit ? t('status_active') : t('status_new')}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && patients.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <div>{t('no_patients')}</div>
                      <div style={{ fontSize: 12.5, marginTop: 4 }}>{t('no_patients_sub')}</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {total > PAGE_SIZE && (
        <div className="pagination">
          <button className="btn btn-secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            {t('prev')}
          </button>
          <button
            className="btn btn-secondary"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            {t('next')}
          </button>
        </div>
      )}
    </div>
  )
}
