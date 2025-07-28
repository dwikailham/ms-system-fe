export type TListUser = {
  uuid: string
  username: string
  name: string
  role: string
  createdAt: string
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

export interface IApiResponseListUser extends TApiListPagination {
  data: Array<TListUser>
}
