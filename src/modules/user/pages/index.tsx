/** React Imports */
import React, { useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import { Card, Grid, CardHeader, Button, InputAdornment, IconButton } from '@mui/material'
import { Add, Clear } from '@mui/icons-material'

/** Component Imports */
import { useGetListUser, usePostCreate } from '../hooks'
import { columns } from './columns'
import { ModalForm } from '../components'
import { useAppDispatch } from '@hooks/useStore'
import { actions as utilActions } from '@stores/utils'

/** Third Party Imports */
import { MaterialReactTable, MRT_PaginationState } from 'material-react-table'
import { TPayloadCreate } from '../types'

const Page = () => {
  /** Hooks */
  const dispatch = useAppDispatch()

  /** States */
  const [globalFilter, setGlobalFilter] = useState<string>()
  console.log('DATA', globalFilter)
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })
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

  const handleOpenModal = useCallback((type: 'ADD' | 'EDIT') => {
    setModalFormState({ type, open: true })
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalFormState({ type: 'ADD', open: false })
  }, [])

  const onCreateUser = useCallback(
    (payload: TPayloadCreate) => {
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
    },
    [dispatch, handleCloseModal, mutationCreate, refetch]
  )

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
            columns={columns(pagination)}
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
          isLoading={isLoadingCreate}
          onSubmit={onCreateUser}
        />
      )}
    </Grid>
  )
}

export default Page
