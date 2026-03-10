import {useAuthStore} from '../store/authStore'
import {client} from '../api/client'
import {
    Box, Button, Container, Paper, Typography
} from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import LogoutIcon from '@mui/icons-material/Logout'

export default function Login() {
    const {user, setUser} = useAuthStore()

    const login = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google-login?returnUrl=https://stapp-itransition-course-project.azurestaticapps.net`
    }

    const logout = async () => {
        await client.post('/api/auth/logout')
        setUser(null)
    }

    if (user) return (
        <Container maxWidth="sm">
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Paper elevation={3} sx={{p: 4, width: '100%', textAlign: 'center'}}>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        {user.email}
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<LogoutIcon/>}
                        onClick={logout}
                        fullWidth
                    >
                        Logout
                    </Button>
                </Paper>
            </Box>
        </Container>
    )

    return (
        <Container maxWidth="sm">
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Paper elevation={3} sx={{p: 4, width: '100%', textAlign: 'center'}}>
                    <Typography variant="h5" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} mb={1}>Welcome</Typography>
                    <Typography variant="body2" color="text.secondary" mb={4}>
                        Sign in to continue
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<GoogleIcon/>}
                        onClick={login}
                        fullWidth
                        size="large"
                    >
                        Sign in with Google
                    </Button>
                </Paper>
            </Box>
        </Container>
    )
}