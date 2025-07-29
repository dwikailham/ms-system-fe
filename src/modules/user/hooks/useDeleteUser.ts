import { useMutation } from '@tanstack/react-query'
import { HttpClient } from '@utils/httpClient'

type TProps = {
  id: string
}

const useDeleteUser = () => {
  return useMutation({
    mutationFn: async (payload: TProps) => {
      const { data } = await HttpClient.delete(`/users/${payload.id}`)

      return data
    }
  })
}

export default useDeleteUser
