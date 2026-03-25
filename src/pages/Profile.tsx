import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Container, Typography, Box, Avatar, Paper,
    Table, TableBody, TableCell, TableHead,
    TableRow, Chip, CircularProgress, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material'
import Navbar from '../components/Navbar'
import { api } from '../services/api'
import { useAuthStore } from '../store/authStore'
import type { Inventory } from '../interfaces/inventory'

interface ProfileData {
    userName: string
    inventories: Inventory[]
}

interface SalesforceForm {
    firstName: string
    lastName: string
    phone: string
    company: string
}

export default function Profile() {
    const { userId } = useParams<{ userId: string }>()
    const navigate = useNavigate()
    const currentUser = useAuthStore(s => s.user)
    const [data, setData] = useState<ProfileData | null>(null)
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [form, setForm] = useState<SalesforceForm>({
        firstName: '', lastName: '', phone: '', company: ''
    })

    useEffect(() => {
        if (!userId) return
        api.get<ProfileData>(`/api/users/${userId}/inventories`)
            .then(r => setData(r.data))
            .finally(() => setLoading(false))
    }, [userId])

    const canSeeButton = currentUser?.isAdmin || currentUser?.id === userId

    const handleSubmit = async () => {
        setSubmitting(true)
        try {
            await api.post('/api/salesforce/contact', form)
            setDialogOpen(false)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
        </Box>
    )

    if (!data) return null

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box display="flex" alignItems="center" gap={2} mb={4}>
                    <Avatar sx={{ width: 64, height: 64 }}>
                        {data.userName?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box flexGrow={1}>
                        <Typography variant="h5">{data.userName}</Typography>
                    </Box>
                    {canSeeButton && (
                        <Button variant="outlined" onClick={() => setDialogOpen(true)}>
                            Add to Salesforce
                        </Button>
                    )}
                </Box>

                <Typography variant="h6" mb={2}>Inventories</Typography>
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Items</TableCell>
                                <TableCell>Tags</TableCell>
                                <TableCell>Visibility</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.inventories.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <Typography variant="body2" color="text.secondary">No inventories.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                            {data.inventories.map(inv => (
                                <TableRow
                                    key={inv.id}
                                    hover
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/inventories/${inv.id}`)}
                                >
                                    <TableCell>{inv.title}</TableCell>
                                    <TableCell>{inv.categoryName}</TableCell>
                                    <TableCell>{inv.itemsCount}</TableCell>
                                    <TableCell>
                                        <Box display="flex" gap={0.5} flexWrap="wrap">
                                            {inv.tags.map(tag => (
                                                <Chip key={tag} label={tag} size="small" />
                                            ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={inv.isPublic ? 'Public' : 'Private'}
                                            color={inv.isPublic ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Container>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add to Salesforce</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} mt={1}>
                        <TextField
                            label="First Name"
                            value={form.firstName}
                            onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
                            fullWidth
                        />
                        <TextField
                            label="Last Name"
                            value={form.lastName}
                            onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
                            fullWidth
                        />
                        <TextField
                            label="Phone"
                            value={form.phone}
                            onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                            fullWidth
                        />
                        <TextField
                            label="Company"
                            value={form.company}
                            onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? <CircularProgress size={20} /> : 'Submit'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}