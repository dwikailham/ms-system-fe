/** React Imports */
import React, { useCallback } from 'react'

/** Next Router */
import { useRouter } from 'next/router'

// ** MUI Imports
import { Card, Grid, CardHeader, CardContent } from '@mui/material'

/** Component Imports */
import { useGetDetail, usePatchData } from '@modules/absensi/hooks'
import { FormController } from '@modules/absensi/components'
import { actions as utilActions } from '@stores/utils'
import { useAppDispatch } from '@hooks/useStore'

/** Type Imports */
import { TForm, TPayloadCreate } from '@modules/absensi/types'

type TProps = {
  id: string
}

const Page = (props: TProps) => {
  /** Hooks */
  const dispatch = useAppDispatch()
  const router = useRouter()

  /** Props */
  const { id } = props

  /** Queries */
  const { data: queryDetail } = useGetDetail({ presence_id: id })

  /** Mutations */
  const { mutateAsync: mutationsSubmit, isPending: isLoadingSubmit } = usePatchData({ id })

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
          <CardHeader title='Edit Kehadiran Pegawai'></CardHeader>
          <CardContent>
            <FormController onSubmit={onSubmit} isLoading={isLoadingSubmit} isEdit dataDetail={queryDetail || null} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Page
