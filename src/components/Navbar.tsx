import { AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { useThemeStore } from '../store/themeStore'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
    const { mode, toggle } = useThemeStore()
    const { user, setUser } = useAuthStore()
    const navigate = useNavigate()

    const logout = async () => {
        await authService.logout()
        setUser(null)
        navigate('/login')
    }

    return (
        <AppBar position="sticky">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
                    Inventory
                </Typography>
                <IconButton color="inherit" onClick={toggle}>
                    {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
                {user?.isAdmin && (
                    <Button color="inherit" onClick={() => navigate('/admin')}>
                        Admin
                    </Button>
                )}
                {user && (
                    <Button color="inherit" onClick={logout}>
                        Logout
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    )
}