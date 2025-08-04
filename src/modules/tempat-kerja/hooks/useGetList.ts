import { useQuery } from '@tanstack/react-query'
import { HttpClient } from '@utils/httpClient'
import { IApiResponseListWorkPlacement, TQueryParams } from '../types'

const useGetList = (props: TQueryParams) => {
  const { limit, page, search } = props

  const params = {
    limit,
    search,
    page: page + 1
  }

  return useQuery<IApiResponseListWorkPlacement>({
    queryKey: ['GET-LIST-WORK-PLACEMENT', limit, page],
    queryFn: async () => {
      const response = await HttpClient.get(`/work-placement`, { params })

      return response.data
    },
    gcTime: 10 * 60 * 1000, // Cache will be kept for 10 minutes
    staleTime: 5 * 60 * 1000, // Data will be considered fresh for 5 minutes
    retry: 1, // Only retry once on failure
    refetchOnWindowFocus: true
  })
}

export default useGetList
