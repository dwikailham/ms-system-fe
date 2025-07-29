export type TProps = {
  open: boolean
  toggle: () => void
  onSubmit: () => void
  description: string
  type: 'warning' | 'error'
  isLoading?: boolean
}
