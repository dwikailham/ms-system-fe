import { TPayloadCreate, TListEmployee, TPayloadUpdate } from '@modules/pegawai/types'

export type TProps = {
  open: boolean
  toggle: () => void
  type: 'ADD' | 'EDIT'
  isLoading: boolean
  onSubmit: (payload: TPayloadCreate, payloadUpdate: TPayloadUpdate) => void
  selectedRow: TListEmployee
}

export type TForm = {
  name: string
  address: string
  salary: number
  is_active: boolean
  work_placement: { label: string; value: string } | null
}
