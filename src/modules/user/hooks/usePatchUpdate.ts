import { useMutation } from '@tanstack/react-query'
import { HttpClient } from '@utils/httpClient'
import { TPayloadUpdate } from '../types'

type TProps = {
  id: string
}

const usePatchUpdate = (props: TProps) => {
  return useMutation({
    mutationFn: async (payload: TPayloadUpdate) => {
      const { data } = await HttpClient.patch(`/users/${props.id}`, payload)

      return data
    }
  })
}

export default usePatchUpdate
