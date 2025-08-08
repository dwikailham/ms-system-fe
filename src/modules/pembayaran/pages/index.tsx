/** React Imports */
import React, { useCallback, useState } from 'react'

// ** MUI Imports
import { Grid, Card, CardHeader, Button } from '@mui/material'
import { Add } from '@mui/icons-material'

/** Next Imports */
import { useRouter } from 'next/router'

/** Component Imports */
import { useGetListPayday } from '@modules/pembayaran/hooks'
import { columns } from './columns'
import { ModalDetail } from '@modules/pembayaran/components'

/** Third Party Imports */
import { MaterialReactTable, MRT_PaginationState } from 'material-react-table'

/** Type Imports */

const Page = () => {
  /** Hooks */
  const router = useRouter()

  /** States */
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false)
  const [paydayIdSelected, setPaydayIdSelected] = useState<string>('')

  /** Queries */
  const {
    data: queryUser,
    isLoading,
    isFetching,
    isError
  } = useGetListPayday({ limit: pagination.pageSize, page: pagination.pageIndex })

  /** Functions */
  const handleChangePagination = useCallback((value: any) => {
    setPagination(value)
  }, [])

  const toggleDetail = useCallback((id: string) => {
    setIsOpenDetail(prev => !prev)
    setPaydayIdSelected(id)
  }, [])

  /** Render Functions */

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Pembayaran Pegawai'
            action={
              <Button startIcon={<Add />} variant='contained' onClick={() => router.push('/pembayaran/add')}>
                Pembayaran
              </Button>
            }
          />
          <MaterialReactTable
            data={queryUser?.data || []}
            columns={columns(pagination, toggleDetail)}
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
      {isOpenDetail && <ModalDetail open={isOpenDetail} toggle={() => toggleDetail('')} paydayId={paydayIdSelected} />}
    </Grid>
  )
}

export default Page
