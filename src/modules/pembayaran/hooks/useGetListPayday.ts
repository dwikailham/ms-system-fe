import { useQuery } from '@tanstack/react-query'
import { HttpClient } from '@utils/httpClient'
import { IApiResponseListPayday, TQueryParams } from '../types'

const useGetListPayday = (props: TQueryParams) => {
  const { limit, page } = props

  const params = {
    limit,
    page: page + 1
  }

  return useQuery<IApiResponseListPayday>({
    queryKey: ['GET-LIST-PAYDAY', limit, page],
    queryFn: async () => {
      const response = await HttpClient.get(`/payday`, { params })

      return response.data
    },
    gcTime: 10 * 60 * 1000, // Cache will be kept for 10 minutes
    staleTime: 5 * 60 * 1000, // Data will be considered fresh for 5 minutes
    retry: 1, // Only retry once on failure
    refetchOnWindowFocus: true
  })
}

export default useGetListPayday
