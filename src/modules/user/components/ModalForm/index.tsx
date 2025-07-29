/** React Imports */
import React, { useCallback, useMemo, useState } from 'react'

// ** MUI Imports
import { Button, Dialog, DialogContent, DialogTitle, DialogActions, TextField, Grid, Autocomplete } from '@mui/material'

/** Component Imports */
import { DEFAULT_VALUES, OPTIONS_ROLE } from './utils'
import { ModalConfirmation } from '@modules/components'

/** Third Party Imports */
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

/** Type Imports */
import { TProps, TForm } from './types'
import { TPayloadCreate } from '@modules/user/types'

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().min(5).required(),
  name: yup.string().required(),
  role: yup.object({ value: yup.string(), label: yup.string() }).required().nullable()
})

const ModalForm = (props: TProps) => {
  /** Props */
  const { open, toggle, type, isLoading, onSubmit } = props

  /** States */
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false)

  /** Vars */
  const isAddForm = useMemo(() => type === 'ADD', [type])

  /** Stores */
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch
  } = useForm<TForm>({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(schema)
  })

  const watchState = watch()

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
      onSubmit(payload)
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
      <DialogTitle id='alert-dialog-title'>{`${isAddForm ? 'Tambah' : 'Edit'} Akun`}</DialogTitle>
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
              name='username'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Username'
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
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggle} variant='outlined' disabled={isLoading}>
          Batal
        </Button>
        <Button onClick={handleSubmit(toggleConfirmation)} variant='contained' disabled={isLoading}>
          Submit
        </Button>
      </DialogActions>
      {openConfirmation && (
        <ModalConfirmation
          onSubmit={() => onSubmitForm(watchState)}
          open={openConfirmation}
          description='Apakah anda yakin untuk menambahkan Akun tersebut ? '
          toggle={toggleConfirmation}
        />
      )}
    </Dialog>
  )
}

export default ModalForm
