import { useEffect, useState } from 'react'
import {
    Container, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Chip,
    IconButton, Menu, MenuItem, Checkbox, Toolbar, Button
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Navbar from '../components/Navbar'
import { userService } from '../services/userService'
import type { User } from '../interfaces/user'

export default function Admin() {
    const [users, setUsers] = useState<User[]>([])
    const [selected, setSelected] = useState<string[]>([])
    const [anchor, setAnchor] = useState<null | HTMLElement>(null)
    const [menuUser, setMenuUser] = useState<User | null>(null)

    const reload = () => userService.getAll().then(setUsers)

    useEffect(() => { reload() }, [])

    const toggleAll = () =>
        setSelected(selected.length === users.length ? [] : users.map(u => u.id))

    const toggleOne = (id: string) =>
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

    const openMenu = (e: React.MouseEvent<HTMLElement>, user: User) => {
        setAnchor(e.currentTarget)
        setMenuUser(user)
    }

    const closeMenu = () => {
        setAnchor(null)
        setMenuUser(null)
    }

    const ids = selected.length > 0 ? selected : menuUser ? [menuUser.id] : []

    const handle = async (action: (ids: string[]) => Promise<unknown>) => {
        await action(ids)
        setSelected([])
        closeMenu()
        reload()
    }

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h5" mb={2}>User Management</Typography>

                {selected.length > 0 && (
                    <Toolbar disableGutters sx={{ mb: 1, gap: 1 }}>
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                            {selected.length} selected
                        </Typography>
                        <Button size="small" onClick={() => handle(userService.block)}>Block</Button>
                        <Button size="small" onClick={() => handle(userService.unblock)}>Unblock</Button>
                        <Button size="small" onClick={() => handle(userService.makeAdmins)}>Make Admin</Button>
                        <Button size="small" onClick={() => handle(userService.removeAdmins)}>Remove Admin</Button>
                        <Button size="small" color="error" onClick={() => handle(userService.delete)}>Delete</Button>
                    </Toolbar>
                )}

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selected.length === users.length && users.length > 0}
                                        indeterminate={selected.length > 0 && selected.length < users.length}
                                        onChange={toggleAll}
                                    />
                                </TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Roles</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map(user => (
                                <TableRow
                                    key={user.id}
                                    hover
                                    selected={selected.includes(user.id)}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selected.includes(user.id)}
                                            onChange={() => toggleOne(user.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{user.userName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.isBlocked ? 'Blocked' : 'Active'}
                                            color={user.isBlocked ? 'error' : 'success'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={e => openMenu(e, user)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={closeMenu}>
                    <MenuItem onClick={() => handle(userService.block)}>Block</MenuItem>
                    <MenuItem onClick={() => handle(userService.unblock)}>Unblock</MenuItem>
                    <MenuItem onClick={() => handle(userService.makeAdmins)}>Make Admin</MenuItem>
                    <MenuItem onClick={() => handle(userService.removeAdmins)}>Remove Admin</MenuItem>
                    <MenuItem onClick={() => handle(userService.delete)} sx={{ color: 'error.main' }}>Delete</MenuItem>
                </Menu>
            </Container>
        </>
    )
}