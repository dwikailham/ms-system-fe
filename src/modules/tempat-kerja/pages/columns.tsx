/** MUI Imports */
import { Box, IconButton } from '@mui/material'
import { Edit } from '@mui/icons-material'

/** Third Party Imports */
import { type MRT_ColumnDef, type MRT_PaginationState } from 'material-react-table'
import { TListWorkPlacement } from '../types'

/** Component Imports */
import CustomChip from 'src/@core/components/mui/chip'

export const columns = (
  pagination: MRT_PaginationState,
  handleOpenEdit: (row: TListWorkPlacement) => void
): MRT_ColumnDef<TListWorkPlacement>[] => [
  {
    header: 'No',
    Cell: ({ row }) => row.index + 1 + pagination.pageIndex * pagination.pageSize,
    size: 10
  },
  {
    accessorKey: 'name',
    header: 'Nama Tempat'
  },
  {
    accessorKey: 'address',
    header: 'Alamat'
  },
  {
    header: 'Status',
    Cell: ({ row }) => {
      const isActive = row.original.is_active || false

      return (
        <CustomChip skin='light' label={isActive ? 'Active' : 'In Active'} color={isActive ? 'success' : 'secondary'} />
      )
    }
  },
  {
    header: 'Action',
    size: 10,
    Cell: ({ row }) => {
      const currentRow = row.original

      return (
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <IconButton onClick={() => handleOpenEdit(currentRow)}>
            <Edit />
          </IconButton>
        </Box>
      )
    }
  }
]
