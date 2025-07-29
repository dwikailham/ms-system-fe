import { TForm } from './types'

export const DEFAULT_VALUES: TForm = {
  is_active: false,
  name: '',
  password: '',
  role: null,
  username: ''
}
export const OPTIONS_ROLE = [
  { value: 'admin', label: 'Admin' },
  { value: 'client', label: 'Client' }
]
