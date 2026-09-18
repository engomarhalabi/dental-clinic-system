import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { patientsApi } from '../services/api'
import { useLanguage } from '../contexts/LanguageContext'

const EMPTY_FORM = {
  fullName: '',
  phone: '',
  dob: '',
  gender: 'male',
  address: '',
  medicalNotes: '',
}

export default function PatientForm() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id) && id !== 'new'

  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    let cancelled = false
    patientsApi
      .get(id)
      .then((res) => {
        if (cancelled) return
        const p = res.data
        setForm({
          fullName: p.fullName || '',
          phone: p.phone || '',
          dob: p.dob ? p.dob.slice(0, 10) : '',
          gender: p.gender || 'male',
          address: p.address || '',
          medicalNotes: p.medicalNotes || '',
        })
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [id, isEdit])

  const setField = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }))

  const validate = () => {
    const next = {}
    if (!form.fullName.trim()) next.fullName = t('required_field')
    if (!form.phone.trim()) next.phone = t('required_field')
    else if (!/^[0-9+\-\s]{7,15}$/.test(form.phone.trim())) next.phone = t('invalid_phone')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaveError('')
    if (!validate()) return
    setSaving(true)
    try {
      if (isEdit) {
        await patientsApi.update(id, form)
      } else {
        await patientsApi.create(form)
      }
      navigate('/patients')
    } catch (err) {
      setSaveError(t('save_error'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(t('confirm_delete'))) return
    await patientsApi.remove(id)
    navigate('/patients')
  }

  if (loading) return null

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>{isEdit ? t('edit_patient') : t('new_patient')}</h2>
        </div>
      </div>

      <div className="card card-pad" style={{ maxWidth: 620 }}>
        {saveError && <div className="form-error-banner">{saveError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="fullName">{t('full_name')}</label>
            <input id="fullName" value={form.fullName} onChange={setField('fullName')} />
            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="phone">{t('phone')}</label>
              <input id="phone" value={form.phone} onChange={setField('phone')} />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>
            <div className="field">
              <label htmlFor="dob">{t('dob')}</label>
              <input id="dob" type="date" value={form.dob} onChange={setField('dob')} />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="gender">{t('gender')}</label>
              <select id="gender" value={form.gender} onChange={setField('gender')}>
                <option value="male">{t('gender_male')}</option>
                <option value="female">{t('gender_female')}</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="address">{t('address')}</label>
              <input id="address" value={form.address} onChange={setField('address')} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="medicalNotes">{t('medical_notes')}</label>
            <textarea id="medicalNotes" rows={3} value={form.medicalNotes} onChange={setField('medicalNotes')} />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? t('saving') : t('save')}
            </button>
            <button className="btn btn-secondary" type="button" onClick={() => navigate('/patients')}>
              {t('cancel')}
            </button>
            {isEdit && (
              <button
                className="btn btn-danger"
                type="button"
                style={{ marginInlineStart: 'auto' }}
                onClick={handleDelete}
              >
                {t('delete')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
