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
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography
} from '@mui/material'

/** Component Imports */
import { ModalConfirmation } from '@modules/components'

/** Third Party Imports */
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

/** Type Imports */
import { TProps, TForm } from './types'
import { TPayloadCreate, TPayloadUpdate } from '@modules/tempat-kerja/types'

const schema = () => {
  return yup.object().shape({
    address: yup.string().required(),
    name: yup.string().required()
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
    defaultValues: {
      address: '',
      is_active: false,
      name: ''
    },

    resolver: yupResolver(schema())
  })

  const watchState = watch()

  /** Side Effects */
  useEffect(() => {
    if (open && isEditForm) {
      const { is_active, name, address } = selectedRow

      setValue('is_active', is_active)
      setValue('name', name)
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
        address: val.address
      }

      const payloadUpdate: TPayloadUpdate = {
        is_active: val.is_active,
        name: val.name,
        address: val.address
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
      maxWidth='sm'
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{`${isEditForm ? 'Edit' : 'Tambah'} Tempat Kerja`}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} mt={1}>
          <Grid item xs={12}>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Nama Tempat Kerja'
                  error={Boolean(errors.name)}
                  helperText={errors?.name?.message || ''}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name='address'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Alamat Lengkap'
                  multiline
                  rows={3}
                  error={Boolean(errors.address)}
                  helperText={errors?.address?.message || ''}
                />
              )}
            />
          </Grid>
          {isEditForm && (
            <Grid item xs={12}>
              <Typography variant='body1'>Status Tempate Kerja</Typography>
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
          description={`Apakah anda yakin untuk ${isEditForm ? 'edit' : 'menambahkan'} data tempat kerja tersebut ? `}
          toggle={toggleConfirmation}
          type='warning'
        />
      )}
    </Dialog>
  )
}

export default ModalForm
