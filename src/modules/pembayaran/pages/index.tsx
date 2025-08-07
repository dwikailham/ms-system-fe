/** React Imports */
import React, { useCallback, useEffect, useMemo } from 'react'

// ** MUI Imports
import {
  Grid,
  Autocomplete,
  TextField,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment
} from '@mui/material'

/** Next Imports */
import { useRouter } from 'next/router'

/** Component Imports */
import { useGetList } from '@modules/tempat-kerja/hooks'
import { useGetListPresence } from '@modules/pembayaran/hooks'

// import { useGetEmployeeByWorkId } from '../../hooks'
// import { columnsEmployee } from './columnsEmployee'
// import { ModalConfirmation } from '@modules/components'

/** Third Party Imports */
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { MaterialReactTable } from 'material-react-table'
import { columns, columnsDetail } from './columns'

/** Type Imports */
import { TForm } from '../types'
import { NumericFormat } from 'react-number-format'

const schema = () => {
  return yup.object().shape({
    work_placement: yup.object({ value: yup.string(), label: yup.string() }).required().nullable(),
    start_date: yup.date().required().nullable(),
    end_date: yup.date().required().nullable()
  })
}

const DEFAULT_VALUES: TForm = {
  work_placement: null,
  end_date: null,
  start_date: null,
  presences: []
}

const Page = () => {
  /** Hooks */
  const router = useRouter()

  /** States */

  /** Stores */
  const {
    control,
    formState: { errors },
    watch,
    setValue
  } = useForm<TForm>({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(schema()),
    mode: 'onChange'
  })

  const watchState = watch()
  const { presences } = watchState

  /** Queries */
  const { data: queryWorkPlacement, isSuccess: successQueryWorkPlacement } = useGetList({ limit: 100, page: 0 })
  const { data: queryPresence, isSuccess } = useGetListPresence({
    endDate: watchState?.end_date ? dayjs(watchState?.end_date)?.format('YYYY-MM-DD') : '',
    startDate: watchState?.start_date ? dayjs(watchState?.start_date)?.format('YYYY-MM-DD') : '',
    work_placement_id: watchState.work_placement?.value || ''
  })

  /** Vars */
  const optionsWorkPlacement = useMemo(() => {
    if (successQueryWorkPlacement && queryWorkPlacement?.data) {
      return queryWorkPlacement?.data.map(el => ({
        label: el.name,
        value: el.uuid
      }))
    }

    return []
  }, [queryWorkPlacement?.data, successQueryWorkPlacement])

  /** Side Effects */
  useEffect(() => {
    if (isSuccess && queryPresence.length) {
      setValue('presences', queryPresence)
    }
  }, [isSuccess, queryPresence, setValue])

  /** Functions */

  /** Render Functions */

  const renderSalary = useCallback(
    (parentIdx: number, childIdx: number) => {
      const currVal = presences[parentIdx].employees[childIdx]

      return (
        <NumericFormat
          fullWidth
          value={currVal.salary_employee}
          className='form-control'
          customInput={TextField}
          thousandSeparator='.'
          decimalSeparator=','
          InputProps={{
            startAdornment: <InputAdornment position='start'>Rp </InputAdornment>
          }}
          onValueChange={({ floatValue }) => {
            const temp = presences
            temp[parentIdx].employees[childIdx].salary_employee = floatValue || 0

            setValue('presences', temp)
          }}
        />
      )
    },
    [presences, setValue]
  )

  return (
    <Card>
      <CardContent>
        <Grid container spacing={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid item xs={12} md={4}>
              <DatePicker
                label={'Mulai '}
                value={watchState.start_date || null}
                onChange={newValue => {
                  setValue('start_date', newValue)
                }}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label={'Akhir '}
                value={watchState.end_date || null}
                onChange={newValue => {
                  setValue('end_date', newValue)
                }}
                disabled={!watchState.start_date}
                minDate={watchState.start_date ?? dayjs()}
                sx={{ width: '100%' }}
              />
            </Grid>
          </LocalizationProvider>

          <Grid item xs={12} md={4}>
            <Controller
              name='work_placement'
              control={control}
              render={({ field: { onChange, ...rest } }) => (
                <Autocomplete
                  {...rest}
                  fullWidth
                  options={optionsWorkPlacement}
                  onChange={(_, value) => {
                    onChange(value)
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      fullWidth
                      label='Tempat Kerja'
                      error={Boolean(errors.work_placement)}
                      helperText={errors.work_placement ? errors?.work_placement?.message : ''}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography fontWeight={'bold'}>List Pegawai</Typography>
          </Grid>
          <Grid item xs={12}>
            <MaterialReactTable
              columns={columns()}
              data={presences || []}
              initialState={{ density: 'compact' }}
              enableColumnActions={false}
              enableColumnFilters={false}
              enableSorting={false}
              enableTopToolbar={false}
              enableBottomToolbar={false}
              enablePagination={false}
              positionExpandColumn='last'
              renderDetailPanel={({ row }) => (
                <MaterialReactTable
                  columns={columnsDetail(renderSalary, row.index)}
                  data={presences?.[row.index].employees || []}
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
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'end'
              }}
            >
              <Button variant='outlined' color='secondary' onClick={() => router.back()}>
                Kembali
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Page
