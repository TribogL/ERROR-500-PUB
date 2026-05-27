import { supabase } from './supabase.js'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

async function request(method, path, body = null) {
  const { data: { session } } = await supabase.auth.getSession()

  const headers = { 'Content-Type': 'application/json' }
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }

  const options = { method, headers }
  if (body) options.body = JSON.stringify(body)

  const res  = await fetch(`${BASE_URL}${path}`, options)
  const data = await res.json()

  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const api = {
  get:    (path)       => request('GET',    path),
  post:   (path, body) => request('POST',   path, body),
  patch:  (path, body) => request('PATCH',  path, body),
  put:    (path, body) => request('PUT',    path, body),
  delete: (path)       => request('DELETE', path)
}
