import { toast, Slide } from 'react-toastify'

type IProps = {
  type: 'success' | 'error' | 'warning'
  text: string
  delay?: number
}

export const notification = ({ type, text, delay = 5000 }: IProps) => {
  if (type === 'success') {
    toast.success(text, {
      containerId: 'B',
      transition: Slide,
      autoClose: delay
    })
  }
  if (type === 'error') {
    toast.error(text, {
      containerId: 'B',
      transition: Slide,
      autoClose: delay
    })
  }
  if (type === 'warning') {
    toast.warning(text, {
      containerId: 'B',
      transition: Slide,
      autoClose: delay
    })
  }
}

export default notification
