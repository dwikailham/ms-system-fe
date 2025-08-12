/** React Imports */
import React, { useCallback } from 'react'

/** Next Imports */
import { useRouter } from 'next/router'

// ** MUI Imports
import { Card, Grid, CardHeader, CardContent } from '@mui/material'

/** Component Imports */
import { usePostAttendance } from '@modules/absensi/hooks'
import { actions as utilActions } from '@stores/utils'
import { useAppDispatch } from '@hooks/useStore'
import { FormController } from '@modules/absensi/components'

/** Type Imports */
import { TForm, TPayloadCreate } from '@modules/absensi/types'

const Page = () => {
  /** Hooks */
  const dispatch = useAppDispatch()
  const router = useRouter()

  /** Mutations */
  const { mutateAsync: mutationsSubmit, isPending: isLoadingSubmit } = usePostAttendance()

  /** Functions */
  const onSubmit = useCallback(
    (val: TForm) => {
      const payload: TPayloadCreate = {
        date: val.date,
        work_placement_id: val.work_placement?.value || '',
        employees: val.employees.map(el => ({
          attendance: el.attendance?.value || '',
          employee_id: el.employee_id,
          notes: el.notes
        }))
      }

      mutationsSubmit(
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

              router.replace('/absensi')
            }
          }
        }
      )
    },
    [dispatch, mutationsSubmit, router]
  )

  /** Render Functions */
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Kehadiran Pegawai'></CardHeader>
          <CardContent>
            <FormController onSubmit={onSubmit} isLoading={isLoadingSubmit} dataDetail={null} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Page
