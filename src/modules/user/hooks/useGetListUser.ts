import { useQuery } from '@tanstack/react-query'
import { HttpClient } from '@utils/httpClient'
import { IApiResponseListUser, TQueryParams } from '../types'

const useGetListUser = (props: TQueryParams) => {
  const { limit, page, search } = props

  const params = {
    limit,
    search,
    page: page + 1
  }

  return useQuery<IApiResponseListUser>({
    queryKey: ['GET-LIST-USER', limit, page],
    queryFn: async () => {
      const response = await HttpClient.get(`/users`, { params })

      return response.data
    },
    gcTime: 10 * 60 * 1000, // Cache will be kept for 10 minutes
    staleTime: 5 * 60 * 1000, // Data will be considered fresh for 5 minutes
    retry: 1, // Only retry once on failure
    refetchOnWindowFocus: true
  })
}

export default useGetListUser
