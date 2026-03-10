import { useEffect, useMemo, useState } from 'react'
import { useAuthStore } from './store/authStore'
import { authService } from './services/authService'
import { CircularProgress, Box, ThemeProvider, CssBaseline, createTheme } from '@mui/material'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useThemeStore } from './store/themeStore'
import Login from './pages/Login'
import Admin from "./pages/Admin.tsx";
import Profile from "./pages/Profile.tsx";

function App() {
    const setUser = useAuthStore(s => s.setUser)
    const user = useAuthStore(s => s.user)
    const [loading, setLoading] = useState(true)
    const mode = useThemeStore(s => s.mode)
    const theme = useMemo(() => createTheme({ palette: { mode } }), [mode])

    useEffect(() => {
        authService.getMe()
            .then(user => setUser(user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                    <CircularProgress />
                </Box>
            ) : (
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                        <Route path="/" element={user ? <div>Home</div> : <Navigate to="/login" />} />
                        <Route path="/admin" element={user?.isAdmin ? <Admin /> : <Navigate to="/" />} />
                        <Route path="/profile/:userId" element={<Profile />} />
                    </Routes>
                </BrowserRouter>
            )}
        </ThemeProvider>
    )
}

export default App