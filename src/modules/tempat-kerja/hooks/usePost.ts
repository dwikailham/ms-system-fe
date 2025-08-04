import { useMutation } from '@tanstack/react-query'
import { HttpClient } from '@utils/httpClient'
import { TPayloadCreate } from '../types'

const usePostCreate = () => {
  return useMutation({
    mutationFn: async (payload: TPayloadCreate) => {
      const { data } = await HttpClient.post('/work-placement', payload)

      return data
    }
  })
}

export default usePostCreate
