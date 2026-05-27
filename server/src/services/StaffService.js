const supabase      = require('../../config/database')
const PersonFactory = require('../factories/PersonFactory')

class StaffService {
  async getAll() {
    const { data, error } = await supabase
      .from('staff')
      .select(`
        id,
        level,
        department,
        hired_at,
        person_id,
        person:persons!staff_person_id_fkey(
          id,
          first_name,
          last_name,
          email
        )
      `)
      .order('hired_at', { ascending: false })

    if (error) throw error
    return data
  }

  async getById(personId) {
    const { data, error } = await supabase
      .from('staff')
      .select('*, persons(*)')
      .eq('person_id', personId)
      .single()
    if (error) throw error
    return PersonFactory.fromDB(data.persons, null, data)
  }

  async create(personId, { level, department, hiredAt }, createdBy) {
    const { data, error } = await supabase
      .from('staff')
      .insert({ person_id: personId, level, department, hired_at: hiredAt, created_by: createdBy })
      .select('id, level, department, hired_at, person_id, person:persons!staff_person_id_fkey(id, first_name, last_name, email)')
      .single()
    if (error) throw error
    return data
  }

  async updateLevel(personId, level) {
    const { data, error } = await supabase
      .from('staff')
      .update({ level })
      .eq('person_id', personId)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async update(personId, { level, department }) {
    const updates = {}
    if (level      !== undefined) updates.level      = level
    if (department !== undefined) updates.department = department

    const { error } = await supabase
      .from('staff')
      .update(updates)
      .eq('person_id', personId)

    if (error) throw error

    const { data: updated, error: e2 } = await supabase
      .from('staff')
      .select('id, level, department, hired_at, person_id')
      .eq('person_id', personId)
      .single()

    if (e2) throw e2

    const { data: person } = await supabase
      .from('persons')
      .select('id, first_name, last_name, email')
      .eq('id', personId)
      .single()

    return { ...updated, person: person || null }
  }

  async remove(personId) {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('person_id', personId)
    if (error) throw error
  }
}

module.exports = new StaffService()
