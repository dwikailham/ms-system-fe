import { useQuery } from '@tanstack/react-query'
import { HttpClient } from '@utils/httpClient'
import { TListPresence } from '../types'

type TProps = {
  work_placement_id: string
  startDate: string
  endDate: string
}

const useGetListPresence = (props: TProps) => {
  const { endDate, startDate, work_placement_id } = props

  return useQuery<TListPresence[]>({
    queryKey: ['GET-LIST-PRESENCE-PAYDAY', endDate, startDate, work_placement_id],
    queryFn: async () => {
      const response = await HttpClient.get(`/payday/list-presence`, { params: { ...props } })

      return response.data
    },
    enabled: Boolean(startDate) && Boolean(endDate) && Boolean(work_placement_id),
    refetchOnWindowFocus: true
  })
}

export default useGetListPresence
