export type TListPresence = {
  uuid: string
  date: string
  work_placement: string
  count_presence: number
  employees: Array<{ name: string }>
}

export type TApiListPagination = {
  meta: {
    totalItems: number
    totalPages: number
    currentPage: number
    pageSize: number
  }
}

export type TQueryParams = {
  page: number
  limit: number
  search?: string
}

export interface IApiResponseListPresence extends TApiListPagination {
  data: Array<TListPresence>
}

export type TPayloadCreate = {
  date: string
  work_placement_id: string
  employees: Array<{
    employee_id: string
    notes: string
    attendance: 'HADIR' | 'TIDAK_HADIR' | 'IZIN' | 'SAKIT'
  }>
}
