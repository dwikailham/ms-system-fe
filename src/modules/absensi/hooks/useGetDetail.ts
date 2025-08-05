import { useQuery } from '@tanstack/react-query'
import { HttpClient } from '@utils/httpClient'
import { TApiDetailPresence } from '../types'

type TProps = {
  presence_id: string
}

const useGetDetail = (props: TProps) => {
  const { presence_id } = props

  return useQuery<TApiDetailPresence>({
    queryKey: ['GET-DETAIL-PRESENCE', presence_id],
    queryFn: async () => {
      const response = await HttpClient.get(`/presence/detail/${presence_id}`)

      return response.data
    },
    enabled: Boolean(presence_id),
    refetchOnWindowFocus: true
  })
}

export default useGetDetail
