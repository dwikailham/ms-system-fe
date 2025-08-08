/** React Imports */
import React, { useCallback, useEffect, useMemo, useState } from 'react'

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
  InputAdornment,
  CardHeader
} from '@mui/material'

/** Next Imports */
import { useRouter } from 'next/router'

/** Component Imports */
import { useGetList } from '@modules/tempat-kerja/hooks'
import { useGetListPresence, usePostPayRoll } from '@modules/pembayaran/hooks'
import { ModalConfirmation } from '@components/index'
import { actions as utilActions } from '@stores/utils'
import { useAppDispatch } from '@hooks/useStore'

/** Third Party Imports */
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { MaterialReactTable } from 'material-react-table'
import { columns, columnsDetail, columnsSummary } from './columns'

/** Type Imports */
import { TForm, TListPresence, GroupedEmployee, TPayloadCreate } from '@modules/pembayaran/types'
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
  const dispatch = useAppDispatch()

  /** States */
  const [isOpenConfirmation, setIsOpenConfirmation] = useState(false)

  /** Stores */
  const {
    control,
    formState: { errors },
    watch,
    setValue,
    handleSubmit
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

  /** Mutations */
  const { mutateAsync: mutationSubmit, isPending: isLoadingSubmit } = usePostPayRoll()

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

  const employees = useMemo(
    (): TListPresence['employees'] => watchState.presences.flatMap(el => el.employees),
    [watchState.presences]
  )

  const grouped: Record<number, GroupedEmployee> = employees.reduce((acc, curr) => {
    const { employee_id, name_employee, salary_employee, attendance } = curr

    if (!acc[employee_id]) {
      acc[employee_id] = {
        employee_id,
        name_employee,
        total_salary: 0,
        total_days: 0
      }
    }

    acc[employee_id].total_salary += salary_employee

    if (attendance === 'HADIR') {
      acc[employee_id].total_days += 1
    }

    return acc
  }, {} as Record<number, GroupedEmployee>)

  const result: GroupedEmployee[] = Object.values(grouped)

  /** Side Effects */
  useEffect(() => {
    if (isSuccess && queryPresence.length) {
      setValue('presences', queryPresence)
    }
  }, [isSuccess, queryPresence, setValue])

  /** Functions */
  const onToggleConfirmation = useCallback(() => setIsOpenConfirmation(prev => !prev), [])

  const onSubmit = useCallback(
    (val: TForm) => {
      const payload: TPayloadCreate = {
        employees: result,
        end_date: dayjs(val.end_date).format('YYYY-MM-DD'),
        start_date: dayjs(val.start_date).format('YYYY-MM-DD'),
        work_placement_id: val?.work_placement?.value || ''
      }

      mutationSubmit(
        { ...payload },
        {
          onSuccess(data) {
            if (data) {
              dispatch(
                utilActions.UtilsShowAlert({
                  msg: data.message || 'DATA SUBMITTED',
                  type: 'success'
                })
              )

              router.replace('/pembayaran')
            }
          }
        }
      )
    },
    [dispatch, mutationSubmit, result, router]
  )

  /** Render Functions */
  const renderSalary = useCallback(
    (parentIdx: number, childIdx: number, isLeave: boolean) => {
      const currVal = presences[parentIdx].employees[childIdx]

      return (
        <NumericFormat
          fullWidth
          value={currVal.salary_employee}
          className='form-control'
          customInput={TextField}
          disabled={isLeave}
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
    <Grid container spacing={6}>
      <Grid item xs={12}>
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
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Rangkuman' />
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={2}>
                <Typography>Bayar Tanggal </Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography fontWeight={'bold'}>{`: ${dayjs().format('DD MMM YYYY')}`}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography>Tempat Kerja </Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography fontWeight={'bold'}>{`: ${watchState.work_placement?.label || ''}`}</Typography>
              </Grid>
              <Grid item xs={12}>
                <MaterialReactTable
                  columns={columnsSummary(result.reduce((sum, emp) => sum + emp.total_salary, 0))}
                  data={result || []}
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
                  <Button variant='contained' onClick={handleSubmit(onToggleConfirmation)}>
                    Submit
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      {isOpenConfirmation && (
        <ModalConfirmation
          onSubmit={() => onSubmit(watchState)}
          open={isOpenConfirmation}
          isLoading={isLoadingSubmit}
          description={`Apakah anda yakin untuk Submit untuk ${dayjs(watchState.start_date).format(
            'DD MMM YYYY'
          )} - ${dayjs(watchState.end_date).format('DD MMM YYYY')}  ? `}
          toggle={onToggleConfirmation}
          type='warning'
        />
      )}
    </Grid>
  )
}

export default Page
