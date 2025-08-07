/** Third Party Imports */
import { type MRT_ColumnDef } from 'material-react-table'
import { TListPresence } from '@modules/pembayaran/types'

/** Component Imports */
import { formatDate } from '@utils/commons'

export const columns = (): MRT_ColumnDef<TListPresence>[] => [
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
  renderSalary: (parentIdx: number, childIndex: number) => React.ReactNode,
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
    Cell: ({ row }) => renderSalary(parentIdx, row.index)
  }
]
