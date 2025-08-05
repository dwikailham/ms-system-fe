import { useQuery } from '@tanstack/react-query'
import { HttpClient } from '@utils/httpClient'
import { IApiResponseEmployee } from '../types'

type TProps = {
  workPlacementId: string
}

const useGetEmployeeByWorkId = (props: TProps) => {
  const { workPlacementId } = props

  return useQuery<IApiResponseEmployee>({
    queryKey: ['GET-LIST-EMPLOYEE-BY-WORKPLACEMENT', workPlacementId],
    queryFn: async () => {
      const response = await HttpClient.get(`/employee/get-by-work-placement`, { params: { ...props } })

      return response.data
    },
    enabled: Boolean(workPlacementId),
    refetchOnWindowFocus: true
  })
}

export default useGetEmployeeByWorkId
