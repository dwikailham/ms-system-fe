export type TListWorkPlacement = {
  id: number
  uuid: string
  name: string
  address: string
  is_active: boolean
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

export interface IApiResponseListWorkPlacement extends TApiListPagination {
  data: Array<TListWorkPlacement>
}

export type TPayloadCreate = {
  name: string
  address: string
}

export interface TPayloadUpdate extends TPayloadCreate {
  is_active: boolean
}
