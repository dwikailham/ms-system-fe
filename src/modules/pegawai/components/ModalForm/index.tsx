/** React Imports */
import React, { useCallback, useMemo, useState, useEffect } from 'react'

// ** MUI Imports
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Grid,
  Autocomplete,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
  InputAdornment
} from '@mui/material'

/** Component Imports */
import { DEFAULT_VALUES } from './utils'
import { ModalConfirmation } from '@modules/components'
import { useGetList } from '@modules/tempat-kerja/hooks'

/** Third Party Imports */
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'

/** Type Imports */
import { TProps, TForm } from './types'
import { TPayloadCreate, TPayloadUpdate } from '@modules/pegawai/types'

const schema = () => {
  return yup.object().shape({
    address: yup.string().required().nullable(),
    name: yup.string().required(),
    salary: yup.number().required(),
    work_placement: yup.object({ value: yup.string(), label: yup.string() }).required().nullable()
  })
}

const ModalForm = (props: TProps) => {
  /** Props */
  const { open, toggle, type, isLoading, onSubmit, selectedRow } = props

  /** States */
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false)

  /** Queries */
  const { data: queryWorkPlacement, isSuccess: successQueryWorkPlacement } = useGetList({ limit: 100, page: 0 })

  /** Vars */
  const isEditForm = useMemo(() => type === 'EDIT', [type])

  const optionsWorkPlacement = useMemo(() => {
    if (successQueryWorkPlacement && queryWorkPlacement?.data) {
      return queryWorkPlacement?.data.map(el => ({
        label: el.name,
        value: el.uuid
      }))
    }

    return []
  }, [queryWorkPlacement?.data, successQueryWorkPlacement])

  /** Stores */
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue
  } = useForm<TForm>({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(schema())
  })

  const watchState = watch()

  /** Side Effects */
  useEffect(() => {
    if (open && isEditForm) {
      const { is_active, name, address, salary, work_placement } = selectedRow

      setValue('is_active', is_active)
      setValue('name', name)
      setValue('salary', salary)
      setValue('work_placement', { label: work_placement.name, value: work_placement.uuid })
      setValue('address', address)
    }
  }, [isEditForm, open, selectedRow, setValue])

  /** Functions */
  const toggleConfirmation = useCallback(() => {
    setOpenConfirmation(prev => !prev)
  }, [])

  const onSubmitForm = useCallback(
    (val: TForm) => {
      const payload: TPayloadCreate = {
        name: val.name,
        address: val.address,
        salary: val.salary,
        work_placement_id: val.work_placement?.value || ''
      }
      const payloadUpdate: TPayloadUpdate = {
        is_active: val.is_active,
        name: val.name,
        address: val.address,
        salary: val.salary,
        work_placement_id: val.work_placement?.value || ''
      }
      onSubmit(payload, payloadUpdate)
      toggleConfirmation()
    },
    [onSubmit, toggleConfirmation]
  )

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth='md'
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{`${isEditForm ? 'Edit' : 'Tambah'} Pegawai`}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} md={6}>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Nama Lengkap'
                  error={Boolean(errors.name)}
                  helperText={errors?.name?.message || ''}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name='work_placement'
              control={control}
              render={({ field: { onChange, ...rest } }) => (
                <Autocomplete
                  {...rest}
                  fullWidth
                  options={optionsWorkPlacement}
                  onChange={(_, value) => onChange(value)}
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
          <Grid item xs={12} md={6}>
            <Controller
              name='address'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Alamat'
                  multiline
                  rows={3}
                  error={Boolean(errors.address)}
                  helperText={errors?.address?.message || ''}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              control={control}
              name={'salary'}
              defaultValue={undefined}
              render={({ field: { onChange, ...rest } }) => (
                <NumericFormat
                  {...rest}
                  fullWidth
                  className='form-control'
                  customInput={TextField}
                  label='Gaji per Hari'
                  thousandSeparator='.'
                  decimalSeparator=','
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>Rp </InputAdornment>
                  }}
                  onValueChange={({ floatValue }) => {
                    onChange(floatValue)
                  }}
                  error={Boolean(errors?.salary)}
                  helperText={errors?.salary?.message || ''}
                />
              )}
            />
          </Grid>

          {isEditForm && (
            <Grid item xs={12}>
              <Typography variant='body1'>Status Pegawai</Typography>
              <FormControl fullWidth>
                <RadioGroup
                  row
                  aria-labelledby='demo-row-radio-buttons-group-label'
                  value={watchState.is_active}
                  onChange={e => {
                    setValue('is_active', e.target.value === 'true')
                  }}
                >
                  <FormControlLabel value={true} control={<Radio />} label='Active' />
                  <FormControlLabel value={false} control={<Radio />} label='Inactive' />
                </RadioGroup>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggle} variant='outlined' disabled={isLoading}>
          Batal
        </Button>
        <Button onClick={handleSubmit(toggleConfirmation)} variant='contained' disabled={isLoading}>
          {isEditForm ? 'Update' : 'Submit'}
        </Button>
      </DialogActions>
      {openConfirmation && (
        <ModalConfirmation
          onSubmit={() => onSubmitForm(watchState)}
          open={openConfirmation}
          description={`Apakah anda yakin untuk ${isEditForm ? 'edit' : 'menambahkan'} Pegawai tersebut ? `}
          toggle={toggleConfirmation}
          type='warning'
        />
      )}
    </Dialog>
  )
}

export default ModalForm
