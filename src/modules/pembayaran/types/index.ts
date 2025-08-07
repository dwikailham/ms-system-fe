import { Dayjs } from 'dayjs'

export type TAutoCompleteField = { value: string; label: string }

export type TListPresence = {
  date: string
  employees: Array<{
    employee_id: number
    work_placement_id: string
    notes: string
    attendance: string
    name_employee: string
    salary_employee: number
  }>
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

export type TPayloadCreate = {
  work_placement_id: number
  start_date: string
  end_date: string
  employees: Array<{
    employee_id: number
    total_days: number
    total_salary: number
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
  start_date: Dayjs | null
  end_date: Dayjs | null
  work_placement: TAutoCompleteField | null
  presences: Array<TListPresence>
}

export type TApiDetailPresence = {
  date: string
  employees: Array<{
    employee_id: number
    work_placement_id: number
  }>
}
