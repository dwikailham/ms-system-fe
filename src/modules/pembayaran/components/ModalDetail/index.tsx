/** React Imports */
import React, { useEffect, useState } from 'react'

// ** MUI Imports
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  DialogTitle,
  Grid,
  Box,
  CircularProgress
} from '@mui/material'

/** Third Party Imports */
import { MaterialReactTable } from 'material-react-table'

/** Component Imports */
import { columnsSummary } from '@modules/pembayaran/pages/columns'
import { useGetDetail } from '@modules/pembayaran/hooks'

/** Type Imports */
import { TProps } from './types'
import { GroupedEmployee } from '@modules/pembayaran/types'
import { formatDate } from '@utils/commons'

const ModalDetail = (props: TProps) => {
  /** Props */
  const { open, toggle, paydayId } = props

  /** States */
  const [dataEmployees, setDataEmployees] = useState<GroupedEmployee[]>([])

  /** Queries */
  const { data: queryDetail, isPending, isSuccess } = useGetDetail({ id: paydayId })

  /** Side Effects */
  useEffect(() => {
    if (isSuccess && Boolean(queryDetail)) {
      setDataEmployees(
        queryDetail?.employees.map(el => ({
          employee_id: el.employee_id || 0,
          name_employee: el.employee.name || '',
          total_days: el.total_days || 0,
          total_salary: Number(el.total_salary) || 0
        }))
      )
    }
  }, [isSuccess, queryDetail])

  /** Functions */

  if (isPending) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth='md'
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle>Detail Transaksi</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={2}>
            Periode
          </Grid>
          <Grid item xs={10}>
            <Typography fontWeight={'bold'}>{`: ${formatDate(queryDetail?.start_date || '')} - ${formatDate(
              queryDetail?.end_date || ''
            )}`}</Typography>
          </Grid>
          <Grid item xs={2}>
            Tempat Kerja
          </Grid>
          <Grid item xs={10}>
            <Typography fontWeight={'bold'}>{`: ${queryDetail?.work_placement}`}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography fontWeight={'bold'}>List Pegawai</Typography>
          </Grid>
          <Grid item xs={12}>
            <MaterialReactTable
              columns={columnsSummary(dataEmployees.reduce((sum, emp) => sum + emp.total_salary, 0))}
              data={dataEmployees || []}
              initialState={{ density: 'compact' }}
              enableColumnActions={false}
              enableSorting={false}
              enableTopToolbar={false}
              enablePagination={false}
              enableBottomToolbar={false}
              mrtTheme={theme => ({
                baseBackgroundColor: theme.palette.background.paper //change default background color
              })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={toggle} variant='outlined'>
          Kembali
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModalDetail
