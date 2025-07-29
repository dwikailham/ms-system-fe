/** React Imports */
import React from 'react'

// ** MUI Imports
import { Button, Dialog, DialogContent, DialogActions, Typography } from '@mui/material'
import { Warning } from '@mui/icons-material'

/** Type Imports */
import { TProps } from './types'

const ModalConfirmation = (props: TProps) => {
  /** Props */
  const { open, toggle, onSubmit, description } = props

  /** Functions */

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth='sm'
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogContent sx={{ textAlign: 'center' }}>
        <Warning color='warning' sx={{ width: 66, height: 66 }} />
        <Typography variant='h6' gutterBottom>
          Confirmation!
        </Typography>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={toggle} variant='outlined'>
          Batal
        </Button>
        <Button onClick={onSubmit} variant='contained'>
          Ya, Tambah
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModalConfirmation
