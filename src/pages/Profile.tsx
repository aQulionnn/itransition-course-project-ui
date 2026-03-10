import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    Container, Typography, Box, Avatar, Paper,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, CircularProgress
} from '@mui/material'
import Navbar from '../components/Navbar'
import { inventoryService } from '../services/inventoryService'
import type { Inventory } from '../interfaces/inventory'

export default function Profile() {
    const { userId } = useParams<{ userId: string }>()
    const [inventories, setInventories] = useState<Inventory[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!userId) return
        inventoryService.getByUserId(userId)
            .then(setInventories)
            .finally(() => setLoading(false))
    }, [userId])

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
        </Box>
    )

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box display="flex" alignItems="center" gap={2} mb={4}>
                    <Avatar sx={{ width: 64, height: 64 }} />
                    <Typography variant="h5">{userId}</Typography>
                </Box>

                <Typography variant="h6" mb={2}>Inventories</Typography>
                <TableContainer component={Paper}>
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
                            {inventories.map(inv => (
                                <TableRow key={inv.id} hover>
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
                </TableContainer>
            </Container>
        </>
    )
}