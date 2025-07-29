/** React Imports */
import React, { useCallback, useState } from 'react'

// ** MUI Imports
import { Card, Grid, CardHeader, Button } from '@mui/material'
import { Add } from '@mui/icons-material'

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
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })
  const [modalFormState, setModalFormState] = useState<{ open: boolean; type: 'ADD' | 'EDIT' }>({
    open: false,
    type: 'ADD'
  })

  /** Query */
  const { data: queryUser, isLoading, isFetching, isError, refetch } = useGetListUser()

  /** Mutations */
  const { mutateAsync: mutationCreate, isPending: isLoadingCreate } = usePostCreate()

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
            enableStickyHeader
            enableStickyFooter
            manualPagination
            mrtTheme={theme => ({
              baseBackgroundColor: theme.palette.background.paper //change default background color
            })}
            onPaginationChange={handleChangePagination}
            state={{
              isLoading,
              pagination,
              showAlertBanner: isError,
              showProgressBars: isFetching
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
