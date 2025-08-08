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

export type TListPayday = {
  payday_id: string
  start_date: string
  end_date: string
  work_placement: string
  total_salary: number
}

export interface IApiResponseListPayday extends TApiListPagination {
  data: Array<TListPayday>
}

export type TQueryParams = {
  page: number
  limit: number
  search?: string
}

export type TPayloadCreate = {
  work_placement_id: string
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

export type GroupedEmployee = {
  employee_id: number
  name_employee: string
  total_salary: number
  total_days: number
}
