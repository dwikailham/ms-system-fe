/** React Imports */
import React, { useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import { Card, Grid, CardHeader, Button, InputAdornment, IconButton } from '@mui/material'
import { Add, Clear } from '@mui/icons-material'

/** Component Imports */
import { useGetListUser, usePostCreate, useDeleteUser, usePatchUpdate } from '../hooks'
import { columns } from './columns'
import { ModalForm } from '../components'
import { useAppDispatch } from '@hooks/useStore'
import { actions as utilActions } from '@stores/utils'
import { ModalConfirmation } from '@modules/components'

/** Third Party Imports */
import { MaterialReactTable, MRT_PaginationState } from 'material-react-table'

/** Type Imports */
import { TPayloadCreate, TPayloadUpdate } from '../types'
import { TListUser } from '../types'

const DEFAULT_VALUE_ROW = {
  uuid: '',
  name: '',
  createdAt: '',
  is_active: false,
  role: '',
  username: ''
}

const Page = () => {
  /** Hooks */
  const dispatch = useAppDispatch()

  /** States */
  const [selectedRow, setSelectedRow] = useState<TListUser>(DEFAULT_VALUE_ROW)
  const [globalFilter, setGlobalFilter] = useState<string>()
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })
  const [isOpenConfirmation, setIsOpenConfirmation] = useState<boolean>(false)
  const [modalFormState, setModalFormState] = useState<{ open: boolean; type: 'ADD' | 'EDIT' }>({
    open: false,
    type: 'ADD'
  })

  /** Query */
  const {
    data: queryUser,
    isLoading,
    isFetching,
    isError,
    refetch
  } = useGetListUser({ limit: pagination.pageSize, page: pagination.pageIndex, search: globalFilter })

  /** Mutations */
  const { mutateAsync: mutationCreate, isPending: isLoadingCreate } = usePostCreate()
  const { mutateAsync: mutationUpdate, isPending: isLoadingUpdate } = usePatchUpdate({ id: selectedRow.uuid })
  const { mutateAsync: mutationDelete, isPending: isLoadingDelete } = useDeleteUser()

  /** Side Effects */
  useEffect(() => {
    if (globalFilter === '' || globalFilter) {
      const delayDebounceFn = setTimeout(() => {
        refetch()
      }, 1500)

      return () => clearTimeout(delayDebounceFn)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalFilter])

  /** Functions */
  const handleChangePagination = useCallback((value: any) => {
    setPagination(value)
  }, [])

  const handleOpenDelete = useCallback((row: TListUser) => {
    setSelectedRow(row)
    setIsOpenConfirmation(true)
  }, [])

  const handleOpenEdit = useCallback((row: TListUser) => {
    setSelectedRow(row)
    setModalFormState({ type: 'EDIT', open: true })
  }, [])

  const handleClose = useCallback(() => {
    setSelectedRow(DEFAULT_VALUE_ROW)
    setIsOpenConfirmation(false)
  }, [])

  const handleOpenModal = useCallback((type: 'ADD' | 'EDIT') => {
    setModalFormState({ type, open: true })
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalFormState({ type: 'ADD', open: false })
    setSelectedRow(DEFAULT_VALUE_ROW)
  }, [])

  const onCreateUser = useCallback(
    (payload: TPayloadCreate, payloadUpdate: TPayloadUpdate) => {
      if (modalFormState.type === 'ADD') {
        mutationCreate(
          { ...payload },
          {
            onSuccess(data) {
              refetch()
              if (data) {
                handleCloseModal()
                dispatch(
                  utilActions.UtilsShowAlert({
                    msg: data.message || 'DATA SUBMITTED',
                    type: 'success'
                  })
                )
              }
            }
          }
        )
      } else {
        mutationUpdate(
          { ...payloadUpdate },
          {
            onSuccess(data) {
              refetch()
              if (data) {
                handleCloseModal()
                dispatch(
                  utilActions.UtilsShowAlert({
                    msg: data.message || 'DATA SUBMITTED',
                    type: 'success'
                  })
                )
              }
            }
          }
        )
      }
    },
    [dispatch, handleCloseModal, modalFormState.type, mutationCreate, mutationUpdate, refetch]
  )

  const onDeleteUser = useCallback(() => {
    const payload = {
      id: selectedRow.uuid
    }
    mutationDelete(
      { ...payload },
      {
        onSuccess(data) {
          refetch()
          if (data) {
            handleClose()
            dispatch(
              utilActions.UtilsShowAlert({
                msg: data.message || 'DATA DELETED',
                type: 'success'
              })
            )
          }
        }
      }
    )
  }, [dispatch, handleClose, mutationDelete, refetch, selectedRow.uuid])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Akun'
            action={
              <Button variant='contained' color='primary' onClick={() => handleOpenModal('ADD')} startIcon={<Add />}>
                Tambah Akun
              </Button>
            }
          ></CardHeader>
          <MaterialReactTable
            data={queryUser?.data || []}
            columns={columns(pagination, handleOpenDelete, handleOpenEdit)}
            initialState={{ density: 'compact' }}
            enableColumnActions={false}
            enableColumnFilters={false}
            enableHiding={false}
            enableDensityToggle={false}
            enableSorting={false}
            manualFiltering
            enableStickyHeader
            enableStickyFooter
            manualPagination
            mrtTheme={theme => ({
              baseBackgroundColor: theme.palette.background.paper //change default background color
            })}
            muiSearchTextFieldProps={{
              placeholder: `Search`,
              sx: { minWidth: '300px' },
              onChange: e => {
                setGlobalFilter(e.target.value)
              },
              variant: 'outlined',
              InputProps: {
                endAdornment: (
                  <InputAdornment position='end'>
                    {globalFilter && (
                      <IconButton onClick={() => setGlobalFilter('')}>
                        <Clear />
                      </IconButton>
                    )}
                  </InputAdornment>
                )
              }
            }}
            onPaginationChange={handleChangePagination}
            state={{
              isLoading,
              pagination,
              showAlertBanner: isError,
              showProgressBars: isFetching,
              globalFilter
            }}
            rowCount={queryUser?.meta.totalItems || 0}
          />
        </Card>
      </Grid>
      {modalFormState.open && (
        <ModalForm
          open={modalFormState.open}
          toggle={handleCloseModal}
          type={modalFormState.type}
          isLoading={isLoadingCreate || isLoadingUpdate}
          onSubmit={onCreateUser}
          selectedRow={selectedRow}
        />
      )}
      {isOpenConfirmation && (
        <ModalConfirmation
          description={`Apakah anda yakin akan menghapus akun ${selectedRow.name} ?`}
          onSubmit={onDeleteUser}
          open={isOpenConfirmation}
          toggle={handleClose}
          isLoading={isLoadingDelete}
          type='error'
        />
      )}
    </Grid>
  )
}

export default Page
