import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box, Button, Container, Paper, Typography,
    TextField, Tabs, Tab, Divider, Alert
} from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import { useAuthStore } from '../store/authStore'
import { api } from '../services/api'
import { login, register, getMe } from '../services/authService'

export default function Login() {
    const navigate = useNavigate()
    const setUser = useAuthStore(s => s.setUser)
    const [tab, setTab] = useState(0)
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleLogin = async () => {
        setError('')
        try {
            await login(api, { email, password })
            const user = await getMe(api)
            setUser(user)
            navigate('/')
        } catch {
            setError('Invalid email or password.')
        }
    }

    const handleRegister = async () => {
        setError('')
        try {
            await register(api, { email, username, password })
            await login(api, { email, password })
            const user = await getMe(api)
            setUser(user)
            navigate('/')
        } catch {
            setError('Registration failed. Email may already be in use.')
        }
    }

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key !== 'Enter') return
        if (tab === 0) { handleLogin() } else { handleRegister() }
    }

    return (
        <Container maxWidth="xs">
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography variant="h5" fontWeight={700} mb={3} textAlign="center">
                        Inventory App
                    </Typography>

                    <Tabs value={tab} onChange={(_, v) => { setTab(v); setError('') }} variant="fullWidth" sx={{ mb: 3 }}>
                        <Tab label="Login" />
                        <Tab label="Register" />
                    </Tabs>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Box display="flex" flexDirection="column" gap={2} onKeyDown={handleKey}>
                        <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
                        {tab === 1 && (
                            <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} fullWidth />
                        )}
                        <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth />

                        <Button variant="contained" size="large" fullWidth onClick={tab === 0 ? handleLogin : handleRegister}>
                            {tab === 0 ? 'Sign In' : 'Create Account'}
                        </Button>
                    </Box>

                    <Divider sx={{ my: 2 }}>or</Divider>

                    <Button variant="outlined" startIcon={<GoogleIcon />} fullWidth disabled>
                        Sign in with Google
                    </Button>
                </Paper>
            </Box>
        </Container>
    )
}