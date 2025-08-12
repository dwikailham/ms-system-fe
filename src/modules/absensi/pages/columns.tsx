/** MUI Imports */
import { Box, IconButton } from '@mui/material'
import { Edit } from '@mui/icons-material'

/** Third Party Imports */
import { type MRT_ColumnDef, type MRT_PaginationState } from 'material-react-table'
import { TListPresence } from '@modules/absensi/types'

/** Component Imports */
import { formatDate } from '@utils/commons'

export const columns = (
  pagination: MRT_PaginationState,
  handleRedirect: (row: TListPresence) => void
): MRT_ColumnDef<TListPresence>[] => [
  {
    header: 'No',
    Cell: ({ row }) => row.index + 1 + pagination.pageIndex * pagination.pageSize,
    size: 10
  },
  {
    accessorKey: 'date',
    header: 'Tanggal Absensi',
    Cell: ({ row }) => {
      const attendanceDate = row.original.date || ''

      return <>{formatDate(attendanceDate)}</>
    }
  },
  {
    accessorKey: 'work_placement',
    header: 'Tempat Kerja'
  },
  {
    accessorKey: 'count_presence',
    header: 'Hadir',
    Cell: ({ row }) => {
      const total_employees = row.original.employees.length
      const total_attendance = row.original.count_presence

      return `${total_attendance} / ${total_employees}`
    }
  },
  {
    header: 'Action',
    size: 10,
    Cell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <IconButton
            onClick={() => {
              handleRedirect(row.original)
            }}
          >
            <Edit />
          </IconButton>
        </Box>
      )
    }
  }
]
