import { TPayloadCreate, TListUser, TPayloadUpdate } from '@modules/user/types'

export type TProps = {
  open: boolean
  toggle: () => void
  type: 'ADD' | 'EDIT'
  isLoading: boolean
  onSubmit: (payload: TPayloadCreate, payloadUpdate: TPayloadUpdate) => void
  selectedRow: TListUser
}

export type TForm = {
  name: string
  username: string
  password: string
  role: { label: string; value: string } | null
  is_active: boolean
}
