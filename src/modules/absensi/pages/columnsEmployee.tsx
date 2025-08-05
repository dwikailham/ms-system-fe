/** MUI Imports */

/** Third Party Imports */
import { type MRT_ColumnDef } from 'material-react-table'
import { TForm } from '../types'
import React from 'react'

/** Component Imports */

export const columnsEmployee = (
  renderAttendance: (idx: number) => React.ReactNode,
  renderNotes: (idx: number) => React.ReactNode
): MRT_ColumnDef<TForm['employees'][0]>[] => [
  {
    header: 'No',
    Cell: ({ row }) => row.index + 1,
    size: 10
  },
  {
    accessorKey: 'name',
    header: 'Nama Pegawai'
  },
  {
    header: 'Kehadiran',
    Cell: ({ row }) => renderAttendance(row.index)
  },
  {
    header: 'Notes',
    Cell: ({ row }) => renderNotes(row.index)
  }
]
