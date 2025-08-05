import { useMutation } from '@tanstack/react-query'
import { HttpClient } from '@utils/httpClient'
import { TPayloadCreate } from '../types'

type TProps = {
  id: string
}

const usePatchData = (props: TProps) => {
  const { id } = props

  return useMutation({
    mutationFn: async (payload: TPayloadCreate) => {
      const { data } = await HttpClient.patch(`/presence/update/${id}`, payload)

      return data
    }
  })
}

export default usePatchData
