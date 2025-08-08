import { useQuery } from '@tanstack/react-query'
import { HttpClient } from '@utils/httpClient'
import { TApiResponseDetail } from '../types'

type TProps = {
  id: string
}

const useGetDetail = (props: TProps) => {
  const { id } = props

  return useQuery<TApiResponseDetail>({
    queryKey: ['GET-DETAIL-PAYDAY', id],
    queryFn: async () => {
      const response = await HttpClient.get(`/payday/detail/${id}`)

      return response.data
    },
    enabled: Boolean(id),
    refetchOnWindowFocus: true
  })
}

export default useGetDetail
