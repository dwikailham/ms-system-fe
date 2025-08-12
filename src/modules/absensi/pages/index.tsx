/** React Imports */
import React, { useCallback, useState } from 'react'

// ** MUI Imports
import { Card, Grid, CardHeader, Button } from '@mui/material'
import { Add } from '@mui/icons-material'

/** Next Imports */
import { useRouter } from 'next/router'

/** Component Imports */
import { useGetList } from '@modules/absensi/hooks'
import { columns } from './columns'

/** Third Party Imports */
import { MaterialReactTable, MRT_PaginationState } from 'material-react-table'
import { TListPresence } from '@modules/absensi/types'

/** Type Imports */

const Page = () => {
  /** Hooks */
  const router = useRouter()

  /** States */
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

  /** Query */
  const {
    data: queryUser,
    isLoading,
    isFetching,
    isError
  } = useGetList({ limit: pagination.pageSize, page: pagination.pageIndex })

  /** Functions */
  const handleChangePagination = useCallback((value: any) => {
    setPagination(value)
  }, [])

  const handleRedirect = useCallback(
    (row: TListPresence) => {
      router.push(`/absensi/edit/${row.uuid}`)
    },
    [router]
  )

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Absensi Pegawai'
            action={
              <Button
                variant='contained'
                onClick={() => router.push('/absensi/add')}
                color='primary'
                startIcon={<Add />}
              >
                Kehadiran
              </Button>
            }
          ></CardHeader>
          <MaterialReactTable
            data={queryUser?.data || []}
            columns={columns(pagination, handleRedirect)}
            initialState={{ density: 'compact' }}
            enableColumnActions={false}
            enableColumnFilters={false}
            enableHiding={false}
            enableDensityToggle={false}
            enableSorting={false}
            enableGlobalFilter={false}
            manualFiltering
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
