import { useEffect, useMemo, useState } from 'react'
import { useAuthStore } from './store/authStore'
import { CircularProgress, Box, ThemeProvider, CssBaseline, createTheme } from '@mui/material'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useThemeStore } from './store/themeStore'
import { api } from './services/api'
import { getMe } from './services/authService'
import Login from './pages/Login'
import Admin from './pages/Admin'
// import Profile from './pages/Profile'
import CreateInventory from './pages/CreateInventory'
import Home from './pages/Home'
import InventoryDetail from "./pages/InventoryDetail.tsx";
import CreateItem from './pages/CreateItem'
import EditItem from './pages/EditItem'

function App() {
    const setUser = useAuthStore(s => s.setUser)
    const user = useAuthStore(s => s.user)
    const [loading, setLoading] = useState(true)
    const mode = useThemeStore(s => s.mode)
    const theme = useMemo(() => createTheme({ palette: { mode } }), [mode])

    useEffect(() => {
        getMe(api)
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
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                        <Route path="/admin" element={user?.isAdmin ? <Admin /> : <Navigate to="/" />} />
                        {/*<Route path="/profile/:userId" element={<Profile />} />*/}
                        <Route path="/inventories/create" element={user ? <CreateInventory /> : <Navigate to="/login" />} />
                        <Route path="/inventories/:id" element={<InventoryDetail />} />
                        <Route path="/inventories/:id/edit" element={<div />} />
                        <Route path="/inventories/:id/items/create" element={user ? <CreateItem /> : <Navigate to="/login" />} />
                        <Route path="/inventories/:id/items/:itemId/edit" element={user ? <EditItem /> : <Navigate to="/login" />} />
                    </Routes>
                </BrowserRouter>
            )}
        </ThemeProvider>
    )
}

export default App