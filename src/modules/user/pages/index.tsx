/** React Imports */
import React, { useCallback, useState } from 'react'

// ** MUI Imports
import { Card, Grid, CardHeader, Button } from '@mui/material'
import { Add } from '@mui/icons-material'

/** Component Imports */
import { useGetListUser } from '../hooks'
import { columns } from './columns'

/** Third Party Imports */
import { MaterialReactTable, MRT_PaginationState } from 'material-react-table'

const Page = () => {
  /** States */
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

  /** Query */
  const { data: queryUser, isLoading, isFetching, isError } = useGetListUser()

  /** Functions */
  const handleChangePagination = useCallback((value: any) => {
    setPagination(value)
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Akun'
            action={
              <Button variant='contained' color='primary' startIcon={<Add />}>
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
    </Grid>
  )
}

export default Page
