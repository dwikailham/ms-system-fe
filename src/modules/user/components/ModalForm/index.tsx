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
  Typography
} from '@mui/material'

/** Component Imports */
import { DEFAULT_VALUES, OPTIONS_ROLE } from './utils'
import { ModalConfirmation } from '@modules/components'

/** Third Party Imports */
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

/** Type Imports */
import { TProps, TForm } from './types'
import { TPayloadCreate, TPayloadUpdate } from '@modules/user/types'

const schema = (isEdit: boolean) => {
  return yup.object().shape({
    username: yup.string().required(),
    name: yup.string().required(),
    role: yup.object({ value: yup.string(), label: yup.string() }).required().nullable(),
    ...(!isEdit ? { password: yup.string().min(5).required() } : undefined)
  })
}

const ModalForm = (props: TProps) => {
  /** Props */
  const { open, toggle, type, isLoading, onSubmit, selectedRow } = props

  /** States */
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false)

  /** Vars */
  const isEditForm = useMemo(() => type === 'EDIT', [type])

  /** Stores */
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue
  } = useForm<TForm>({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(schema(isEditForm))
  })

  const watchState = watch()

  /** Side Effects */
  useEffect(() => {
    if (open && isEditForm) {
      const { is_active, name, username, role } = selectedRow
      const optionSelected = OPTIONS_ROLE.find(el => el.value === role)

      setValue('is_active', is_active)
      setValue('name', name)
      setValue('username', username)
      setValue('role', optionSelected || null)
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
        password: val.password,
        role: val.role?.value || '',
        username: val.username
      }
      const payloadUpdate: TPayloadUpdate = {
        is_active: val.is_active,
        role: val.role?.value || ''
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
      <DialogTitle id='alert-dialog-title'>{`${isEditForm ? 'Edit' : 'Tambah'} Akun`}</DialogTitle>
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
                  disabled={isEditForm}
                  label='Nama Lengkap'
                  error={Boolean(errors.name)}
                  helperText={errors?.name?.message || ''}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name='username'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Username'
                  disabled={isEditForm}
                  error={Boolean(errors.username)}
                  helperText={errors?.username?.message || ''}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name='role'
              control={control}
              render={({ field: { onChange, ...rest } }) => (
                <Autocomplete
                  {...rest}
                  fullWidth
                  options={OPTIONS_ROLE}
                  onChange={(_, value) => onChange(value)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      fullWidth
                      label='Role'
                      error={Boolean(errors.role)}
                      helperText={errors.role ? errors?.role?.message : ''}
                    />
                  )}
                />
              )}
            />
          </Grid>
          {!isEditForm && (
            <Grid item xs={12} md={6}>
              <Controller
                name='password'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Password'
                    type='password'
                    error={Boolean(errors.password)}
                    helperText={errors?.password?.message || ''}
                  />
                )}
              />
            </Grid>
          )}
          {isEditForm && (
            <Grid item xs={12}>
              <Typography variant='body1'>Status Akun</Typography>
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
          description={`Apakah anda yakin untuk ${isEditForm ? 'edit' : 'menambahkan'} Akun tersebut ? `}
          toggle={toggleConfirmation}
          type='warning'
        />
      )}
    </Dialog>
  )
}

export default ModalForm
