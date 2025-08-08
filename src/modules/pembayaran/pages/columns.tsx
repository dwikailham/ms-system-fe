/** Third Party Imports */
import { type MRT_ColumnDef } from 'material-react-table'
import { TListPresence, GroupedEmployee } from '@modules/pembayaran/types'
import { numericFormatter } from 'react-number-format'

/** Component Imports */
import { formatDate } from '@utils/commons'
import { Typography } from '@mui/material'

export const columnsAdd = (): MRT_ColumnDef<TListPresence>[] => [
  {
    header: 'No',
    Cell: ({ row }) => row.index + 1,
    size: 10
  },
  {
    accessorKey: 'date',
    header: 'Tanggal Absen',
    Cell: ({ row }) => {
      const attendanceDate = row.original.date || ''

      return <>{formatDate(attendanceDate)}</>
    }
  }
]

export const columnsDetail = (
  renderSalary: (parentIdx: number, childIndex: number, isLeave: boolean) => React.ReactNode,
  parentIdx: number
): MRT_ColumnDef<TListPresence['employees'][0]>[] => [
  {
    accessorKey: 'name_employee',
    header: 'Nama Pegawai'
  },
  {
    accessorKey: 'attendance',
    header: 'Kehadiran'
  },
  {
    accessorKey: 'notes',
    header: 'Catatan'
  },
  {
    header: 'Gaji per hari',
    Cell: ({ row }) => renderSalary(parentIdx, row.index, row.original.attendance !== 'HADIR')
  }
]

export const columnsSummary = (total: number): MRT_ColumnDef<GroupedEmployee>[] => [
  {
    accessorKey: 'name_employee',
    header: 'Nama Pegawai'
  },
  {
    accessorKey: 'total_days',
    header: 'Total Kehadiran',
    Cell: ({ row }) => `${row.original.total_days} hari`
  },
  {
    accessorKey: 'total_salary',
    header: 'Total',
    Cell: ({ row }) => {
      const amount = row.original.total_salary

      return `Rp ${numericFormatter(amount.toString(), { thousandSeparator: '.' })}`
    },
    Footer: () => {
      return (
        <Typography fontWeight={'bold'}>{`Rp. ${numericFormatter(total.toString(), {
          thousandSeparator: '.'
        })}`}</Typography>
      )
    }
  }
]
