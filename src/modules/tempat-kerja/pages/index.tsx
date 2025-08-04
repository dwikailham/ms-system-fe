/** React Imports */
import React, { useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import { Card, Grid, CardHeader, Button, InputAdornment, IconButton } from '@mui/material'
import { Add, Clear } from '@mui/icons-material'

/** Component Imports */
import { useGetList, usePatchData, usePostData } from '../hooks'
import { columns } from './columns'
import { ModalForm } from '../components'
import { actions as utilActions } from '@stores/utils'
import { useAppDispatch } from '@hooks/useStore'

/** Third Party Imports */
import { MaterialReactTable, MRT_PaginationState } from 'material-react-table'

/** Type Imports */
import { TListWorkPlacement, TPayloadCreate, TPayloadUpdate } from '../types'

const DEFAULT_VALUE_ROW: TListWorkPlacement = {
  uuid: '',
  name: '',
  is_active: false,
  address: ''
}

const Page = () => {
  /** Hooks */
  const dispatch = useAppDispatch()

  /** States */
  const [globalFilter, setGlobalFilter] = useState<string>()
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })
  const [selectedRow, setSelectedRow] = useState<TListWorkPlacement>(DEFAULT_VALUE_ROW)
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
  } = useGetList({ limit: pagination.pageSize, page: pagination.pageIndex, search: globalFilter })

  /** Mutations */
  const { mutateAsync: mutationCreate, isPending: isLoadingCreate } = usePostData()
  const { mutateAsync: mutationUpdate, isPending: isLoadingUpdate } = usePatchData({ id: selectedRow.uuid })

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

  const handleOpenEdit = useCallback((row: TListWorkPlacement) => {
    setSelectedRow(row)
    setModalFormState({ type: 'EDIT', open: true })
  }, [])

  const handleOpenModal = useCallback((type: 'ADD' | 'EDIT') => {
    setModalFormState({ type, open: true })
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalFormState({ type: 'ADD', open: false })
    setSelectedRow(DEFAULT_VALUE_ROW)
  }, [])

  const onSubmitData = useCallback(
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

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Tempat Kerja'
            action={
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  handleOpenModal('ADD')
                }}
                startIcon={<Add />}
              >
                Tambah Data
              </Button>
            }
          ></CardHeader>
          <MaterialReactTable
            data={queryUser?.data || []}
            columns={columns(pagination, handleOpenEdit)}
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
          onSubmit={onSubmitData}
          selectedRow={selectedRow}
        />
      )}
    </Grid>
  )
}

export default Page
