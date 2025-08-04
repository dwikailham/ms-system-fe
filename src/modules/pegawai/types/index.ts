export type TListEmployee = {
  uuid: string
  name: string
  address: string
  is_active: boolean
  salary: number
  work_placement: {
    uuid: string
    name: string
  }
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

export interface IApiResponseListEmployee extends TApiListPagination {
  data: Array<TListEmployee>
}

export type TPayloadCreate = {
  name: string
  address: string
  salary: number
  work_placement_id: string
}

export interface TPayloadUpdate extends TPayloadCreate {
  is_active: boolean
}
