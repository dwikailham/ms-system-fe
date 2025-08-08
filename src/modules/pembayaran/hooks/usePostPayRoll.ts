import { useMutation } from '@tanstack/react-query'
import { HttpClient } from '@utils/httpClient'
import { TPayloadCreate } from '@modules/pembayaran/types'

const usePostPayRoll = () => {
  return useMutation({
    mutationFn: async (payload: TPayloadCreate) => {
      const { data } = await HttpClient.post('/payday', payload)

      return data
    }
  })
}

export default usePostPayRoll
