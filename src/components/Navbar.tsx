import { useState } from 'react'
import {
    AppBar, Toolbar, Typography, IconButton, Button,
    InputBase, Box, alpha, Avatar
} from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import { useThemeStore } from '../store/themeStore'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export default function Navbar() {
    const { mode, toggle } = useThemeStore()
    const { user, setUser } = useAuthStore()
    const navigate = useNavigate()
    const [search, setSearch] = useState('')

    const logout = async () => {
        await api.post('/api/auth/logout')
        setUser(null)
        navigate('/login')
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`)
    }

    return (
        <AppBar position="sticky">
            <Toolbar sx={{ gap: 1 }}>
                <Typography
                    variant="h6"
                    sx={{ cursor: 'pointer', fontWeight: 700, mr: 2, whiteSpace: 'nowrap' }}
                    onClick={() => navigate('/')}
                >
                    Inventory
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSearch}
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: alpha('#fff', 0.15),
                        borderRadius: 1,
                        px: 1,
                        '&:hover': { bgcolor: alpha('#fff', 0.25) },
                    }}
                >
                    <SearchIcon sx={{ mr: 1, opacity: 0.8 }} />
                    <InputBase
                        placeholder="Search inventories…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        sx={{ color: 'inherit', width: '100%' }}
                    />
                </Box>

                <IconButton color="inherit" onClick={toggle}>
                    {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>

                {user && (
                    <Button
                        color="inherit"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/inventories/create')}
                        sx={{ whiteSpace: 'nowrap' }}
                    >
                        New
                    </Button>
                )}

                {user?.isAdmin && (
                    <Button color="inherit" onClick={() => navigate('/admin')}>
                        Admin
                    </Button>
                )}

                {user ? (
                    <>
                        <IconButton onClick={() => navigate(`/profile/${user.id}`)} sx={{ p: 0.5 }}>
                            <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                                {user.userName?.[0]?.toUpperCase()}
                            </Avatar>
                        </IconButton>
                        <Button color="inherit" onClick={logout}>Logout</Button>
                    </>
                ) : (
                    <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
                )}
            </Toolbar>
        </AppBar>
    )
}