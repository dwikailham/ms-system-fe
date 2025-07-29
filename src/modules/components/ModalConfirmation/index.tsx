/** React Imports */
import React, { useCallback } from 'react'

// ** MUI Imports
import { Button, Dialog, DialogContent, DialogActions, Typography } from '@mui/material'
import { Warning, Report } from '@mui/icons-material'

/** Type Imports */
import { TProps } from './types'

const ModalConfirmation = (props: TProps) => {
  /** Props */
  const { open, toggle, onSubmit, description, isLoading = false, type } = props

  /** Functions */
  const handleIconRender = useCallback(() => {
    switch (type) {
      case 'error':
        return <Report color='error' sx={{ width: 66, height: 66 }} />
      case 'warning':
        return <Warning color='warning' sx={{ width: 66, height: 66 }} />

      default:
        return <></>
    }
  }, [type])

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth='sm'
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogContent sx={{ textAlign: 'center' }}>
        {handleIconRender()}
        <Typography variant='h6' gutterBottom>
          Confirmation!
        </Typography>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button disabled={isLoading} onClick={toggle} variant='outlined'>
          Batal
        </Button>
        <Button disabled={isLoading} onClick={onSubmit} variant='contained'>
          Ya, Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModalConfirmation
