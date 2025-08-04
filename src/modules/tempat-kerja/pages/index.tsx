/** React Imports */
import React, { useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import { Card, Grid, CardHeader, Button, InputAdornment, IconButton } from '@mui/material'
import { Add, Clear } from '@mui/icons-material'

/** Component Imports */
import { useGetList } from '../hooks'
import { columns } from './columns'

// import { useAppDispatch } from '@hooks/useStore'

/** Third Party Imports */
import { MaterialReactTable, MRT_PaginationState } from 'material-react-table'

/** Type Imports */
// import { TListWorkPlacement } from '../types'

// const DEFAULT_VALUE_ROW = {
//   uuid: '',
//   name: '',
//   createdAt: '',
//   is_active: false,
//   role: '',
//   username: ''
// }

const Page = () => {
  /** Hooks */
  //   const dispatch = useAppDispatch()

  /** States */
  const [globalFilter, setGlobalFilter] = useState<string>()
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
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
                  console.log('clicked')
                }}
                startIcon={<Add />}
              >
                Tambah Data
              </Button>
            }
          ></CardHeader>
          <MaterialReactTable
            data={queryUser?.data || []}
            columns={columns(pagination, () => {
              console.log('')
            })}
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
    </Grid>
  )
}

export default Page
