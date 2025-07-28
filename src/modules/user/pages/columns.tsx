/** MUI Imports */
import { Box, Typography, IconButton } from '@mui/material'
import { AdminPanelSettings, Person, Edit, Delete } from '@mui/icons-material'

/** Third Party Imports */
import { type MRT_ColumnDef, type MRT_PaginationState } from 'material-react-table'
import { TListUser } from '../types'

/** Component Imports */
import { getInitials, formatDate } from '@utils/commons'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

export const columns = (pagination: MRT_PaginationState): MRT_ColumnDef<TListUser>[] => [
  {
    header: 'No',
    Cell: ({ row }) => row.index + 1 + pagination.pageIndex * pagination.pageSize,
    size: 10
  },
  {
    accessorKey: 'username',
    header: 'Username',
    Cell: ({ row }) => {
      const name = row.original.name || ''
      const username = row.original.username || ''

      return (
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <CustomAvatar variant='rounded' skin='light-static'>
            {getInitials(username)}
          </CustomAvatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography fontWeight={500}>{`${name}`}</Typography>
            <Typography variant='body2'>{`${username}`}</Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    accessorKey: 'role',
    header: 'Role',
    Cell: ({ row }) => {
      const role = row.original.role || ''

      const icon = role === 'admin' ? <AdminPanelSettings color='primary' /> : <Person color='success' />

      return (
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          {icon}
          <Typography>{`${role.charAt(0).toUpperCase() + role.slice(1)}`}</Typography>
        </Box>
      )
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Dibuat Pada',
    Cell: ({ row }) => {
      const createdAt = row.original.createdAt || ''

      return <>{formatDate(createdAt)}</>
    }
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
    Cell: () => {
      return (
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <IconButton>
            <Delete />
          </IconButton>
          <IconButton>
            <Edit />
          </IconButton>
        </Box>
      )
    }
  }
]
