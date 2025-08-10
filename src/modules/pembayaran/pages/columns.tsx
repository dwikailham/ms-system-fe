/** Third Party Imports */
import { type MRT_PaginationState, type MRT_ColumnDef } from 'material-react-table'
import { TListPresence, GroupedEmployee, TListPayday } from '@modules/pembayaran/types'

/** MUI Material */
import { Typography, IconButton } from '@mui/material'
import { RemoveRedEyeOutlined } from '@mui/icons-material'

/** Component Imports */
import { formatDate, formatAmount } from '@utils/commons'

export const columns = (
  pagination: MRT_PaginationState,
  toggleDetail: (id: string) => void
): MRT_ColumnDef<TListPayday>[] => [
  {
    header: 'No',
    Cell: ({ row }) => row.index + 1 + pagination.pageIndex * pagination.pageSize,
    size: 10
  },
  {
    accessorKey: 'work_placement',
    header: 'Tempat Kerja'
  },
  {
    accessorKey: 'start_date',
    header: 'Tanggal Mulai',
    Cell: ({ row }) => {
      const date = row.original.start_date || ''

      return <>{formatDate(date)}</>
    }
  },
  {
    accessorKey: 'end_date',
    header: 'Tanggal Akhir',
    Cell: ({ row }) => {
      const date = row.original.end_date || ''

      return <>{formatDate(date)}</>
    }
  },
  {
    accessorKey: 'total_salary',
    header: 'Total',
    Cell: ({ row }) => {
      const amount = row.original.total_salary

      return `Rp ${formatAmount(amount)}`
    }
  },
  {
    header: 'Action',
    size: 10,
    Cell: ({ row }) => {
      return (
        <IconButton onClick={() => toggleDetail(row.original.payday_id)}>
          <RemoveRedEyeOutlined />
        </IconButton>
      )
    }
  }
]

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

      return `Rp ${formatAmount(amount)}`
    },
    Footer: () => {
      return <Typography fontWeight={'bold'}>{`Rp. ${formatAmount(total)}`}</Typography>
    }
  }
]
