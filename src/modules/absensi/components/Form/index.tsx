/** React Imports */
import React, { useCallback, useEffect, useMemo, useState } from 'react'

// ** MUI Imports
import { Grid, Autocomplete, TextField, Typography, Box, Button } from '@mui/material'

/** Component Imports */
import { useGetList } from '@modules/tempat-kerja/hooks'
import { useGetEmployeeByWorkId } from '../../hooks'
import { columnsEmployee } from './columnsEmployee'
import { ModalConfirmation } from '@modules/components'

/** Third Party Imports */
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import dayjs from 'dayjs'
import { MaterialReactTable } from 'material-react-table'

/** Type Imports */
import { TApiDetailPresence, TAutoCompleteField, TForm } from '../../types'

const schema = () => {
  return yup.object().shape({
    work_placement: yup.object({ value: yup.string(), label: yup.string() }).required().nullable(),
    employees: yup.array().of(
      yup.object().shape({
        attendance: yup.object({ value: yup.string(), label: yup.string() }).required('Required').nullable()
      })
    )
  })
}

const DEFAULT_VALUES: TForm = {
  work_placement: null,
  date: dayjs().format('YYYY-MM-DD'),
  employees: []
}

type TProps = {
  onSubmit: (val: TForm) => void
  isLoading: boolean
  isEdit?: boolean
  dataDetail: TApiDetailPresence | null
}

const Page = (props: TProps) => {
  /** Props */
  const { onSubmit, isLoading, isEdit = false, dataDetail } = props

  /** States */
  const [isOpenConfirmation, setIsOpenConfirmation] = useState(false)

  /** Stores */
  const {
    control,
    formState: { errors },
    watch,
    handleSubmit,
    setValue
  } = useForm<TForm>({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(schema()),
    mode: 'onChange'
  })
  const watchState = watch()

  /** Queries */
  const { data: queryWorkPlacement, isSuccess: successQueryWorkPlacement } = useGetList({ limit: 100, page: 0 })
  const { data: queryEmployee, isSuccess: isSuccessEmployee } = useGetEmployeeByWorkId({
    workPlacementId: !isEdit ? watchState.work_placement?.value || '' : ''
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

  const optionsAttendance = useMemo(
    () => [
      { value: 'HADIR', label: 'Hadir' },
      { value: 'TIDAK_HADIR', label: 'Tidak Hadir' },
      { value: 'IZIN', label: 'Izin' }
    ],
    []
  )

  /** Side Effects */
  useEffect(() => {
    if (isSuccessEmployee && queryEmployee.length) {
      setValue(
        'employees',
        queryEmployee.map(el => ({
          employee_id: el.uuid,
          attendance: null,
          notes: '',
          name: el.name
        }))
      )
    }
  }, [isSuccessEmployee, queryEmployee, setValue])

  useEffect(() => {
    if (dataDetail && isEdit) {
      setValue('date', dataDetail?.date)
      setValue('work_placement', { label: dataDetail?.work_placement.name, value: dataDetail?.work_placement.id })
      setValue(
        'employees',
        dataDetail?.employees.map(el => ({
          name: el.name,
          notes: el.notes,
          employee_id: el.id,
          attendance: optionsAttendance.find(item => item.value === el.attendance) || null
        }))
      )
    }
  }, [dataDetail, isEdit, optionsAttendance, setValue])

  /** Functions */
  const onToggleConfirmation = useCallback(() => setIsOpenConfirmation(prev => !prev), [])

  /** Render Functions */
  const renderAttendance = useCallback(
    (idx: number) => {
      const val = watchState?.employees[idx]?.attendance
      const errorAttendance = errors?.employees?.[idx]?.attendance

      return (
        <Autocomplete
          key={idx}
          id='combo-box-demo'
          size='small'
          options={optionsAttendance}
          onChange={(_, values) => {
            const temp = watchState?.employees
            temp[idx].attendance = values || null
            setValue(`employees`, temp)
          }}
          value={val}
          getOptionLabel={(options: TAutoCompleteField) => options.label}
          fullWidth
          renderInput={params => (
            <TextField
              {...params}
              className='form-control'
              color='primary'
              fullWidth
              error={Boolean(errorAttendance)}
            />
          )}
        />
      )
    },
    [errors?.employees, optionsAttendance, setValue, watchState?.employees]
  )

  const renderNotes = useCallback(
    (idx: number) => {
      return (
        <TextField
          key={idx}
          onChange={e => {
            const values = e.target.value
            const temp = watchState?.employees
            temp[idx].notes = values || ''
            setValue(`employees`, temp)
          }}
          size='small'
          value={watchState?.employees[idx]?.notes || ''}
          className='form-control'
          color='primary'
          fullWidth
        />
      )
    },
    [setValue, watchState.employees]
  )

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={4}>
        <TextField label='Tanggal' disabled value={dayjs(watchState.date).format('DD MMMM YYYY')} fullWidth />
      </Grid>
      <Grid item xs={12} md={4}>
        <Controller
          name='work_placement'
          control={control}
          render={({ field: { onChange, ...rest } }) => (
            <Autocomplete
              {...rest}
              fullWidth
              disabled={isEdit}
              options={optionsWorkPlacement}
              onChange={(_, value) => {
                onChange(value)
                setValue('employees', [])
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
          data={watchState.employees}
          columns={columnsEmployee(renderAttendance, renderNotes)}
          initialState={{ density: 'compact' }}
          enableColumnActions={false}
          enableColumnFilters={false}
          enableSorting={false}
          enableTopToolbar={false}
          enableBottomToolbar={false}
          enablePagination={false}
          enableStickyHeader
          enableStickyFooter
          manualPagination
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
          <Button variant='outlined' color='secondary'>
            Kembali
          </Button>
          <Button onClick={handleSubmit(onToggleConfirmation)} variant='contained'>
            {isEdit ? 'Update' : 'Submit'}
          </Button>
        </Box>
      </Grid>
      {isOpenConfirmation && (
        <ModalConfirmation
          onSubmit={() => onSubmit(watchState)}
          open={isOpenConfirmation}
          isLoading={isLoading}
          description={`Apakah anda yakin untuk ${isEdit ? 'Update' : 'Submit'} data Absent ? `}
          toggle={onToggleConfirmation}
          type='warning'
        />
      )}
    </Grid>
  )
}

export default Page
