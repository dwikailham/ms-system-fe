import { TPayloadCreate, TListWorkPlacement, TPayloadUpdate } from '@modules/tempat-kerja/types'

export type TProps = {
  open: boolean
  toggle: () => void
  type: 'ADD' | 'EDIT'
  isLoading: boolean
  onSubmit: (payload: TPayloadCreate, payloadUpdate: TPayloadUpdate) => void
  selectedRow: TListWorkPlacement
}

export type TForm = {
  name: string
  address: string
  is_active: boolean
}
