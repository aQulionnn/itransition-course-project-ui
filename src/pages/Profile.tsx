import {useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {
    Container, Typography, Box, Avatar, Paper,
    Table, TableBody, TableCell, TableHead,
    TableRow, Chip, CircularProgress
} from '@mui/material'
import Navbar from '../components/Navbar'
import {api} from '../services/api'
import type {Inventory} from '../interfaces/inventory'

interface ProfileData {
    userName: string
    inventories: Inventory[]
}

export default function Profile() {
    const {userId} = useParams<{ userId: string }>()
    const navigate = useNavigate()
    const [data, setData] = useState<ProfileData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!userId) return
        api.get<ProfileData>(`/api/users/${userId}/inventories`)
            .then(r => setData(r.data))
            .finally(() => setLoading(false))
    }, [userId])

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress/>
        </Box>
    )

    if (!data) return null

    return (
        <>
            <Navbar/>
            <Container maxWidth="lg" sx={{mt: 4}}>
                <Box display="flex" alignItems="center" gap={2} mb={4}>
                    <Avatar sx={{width: 64, height: 64}}>
                        {data.userName?.[0]?.toUpperCase()}
                    </Avatar>
                    <Typography variant="h5">{data.userName}</Typography>
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
                                    sx={{cursor: 'pointer'}}
                                    onClick={() => navigate(`/inventories/${inv.id}`)}
                                >
                                    <TableCell>{inv.title}</TableCell>
                                    <TableCell>{inv.categoryName}</TableCell>
                                    <TableCell>{inv.itemsCount}</TableCell>
                                    <TableCell>
                                        <Box display="flex" gap={0.5} flexWrap="wrap">
                                            {inv.tags.map(tag => (
                                                <Chip key={tag} label={tag} size="small"/>
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
        </>
    )
}