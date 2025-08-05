export type TAutoCompleteField = { value: string; label: string }

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
    attendance: string
  }>
}

export type IApiResponseEmployee = Array<{
  uuid: string
  name: string
  work_placement: {
    name: string
  }
}>

export type TForm = {
  date: string
  work_placement: TAutoCompleteField | null
  employees: Array<{
    employee_id: string
    name: string
    notes: string
    attendance: TAutoCompleteField | null
  }>
}
