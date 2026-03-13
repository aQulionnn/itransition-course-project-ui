import { useEffect, useState } from 'react'
import {
    Container, Typography, Box, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Chip
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { api } from '../services/api'
import { getLatestInventories, getTopInventories } from '../services/inventoryService'
import { getTags } from '../services/tagService'
import type { LatestInventory, TopInventory } from '../interfaces/inventory'
import type { Tag } from '../interfaces/tag'

export default function Home() {
    const navigate = useNavigate()
    const [latest, setLatest] = useState<LatestInventory[]>([])
    const [top, setTop] = useState<TopInventory[]>([])
    const [tags, setTags] = useState<Tag[]>([])

    useEffect(() => {
        getLatestInventories(api).then(setLatest)
        getTopInventories(api).then(setTop)
        getTags(api).then(setTags)
    }, [])

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>

                <Typography variant="h6" mb={2}>Tag Cloud</Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mb={5}>
                    {tags.map(tag => (
                        <Chip
                            key={tag.id}
                            label={`${tag.name} (${tag.count})`}
                            onClick={() => navigate(`/search?tag=${tag.name}`)}
                            sx={{ fontSize: `${Math.min(0.75 + tag.count * 0.1, 1.4)}rem` }}
                        />
                    ))}
                </Box>

                <Typography variant="h6" mb={2}>Top 5 Inventories</Typography>
                <TableContainer component={Paper} sx={{ mb: 5 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Creator</TableCell>
                                <TableCell align="right">Items</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {top.map(inv => (
                                <TableRow
                                    key={inv.id}
                                    hover
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/inventories/${inv.id}`)}
                                >
                                    <TableCell>{inv.title}</TableCell>
                                    <TableCell
                                        sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                                        onClick={e => { e.stopPropagation(); navigate(`/profile/${inv.creatorId}`) }}
                                    >
                                        {inv.creatorName}
                                    </TableCell>
                                    <TableCell align="right">{inv.itemsCount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="h6" mb={2}>Latest Inventories</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Creator</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {latest.map(inv => (
                                <TableRow
                                    key={inv.id}
                                    hover
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/inventories/${inv.id}`)}
                                >
                                    <TableCell>{inv.title}</TableCell>
                                    <TableCell sx={{ maxWidth: 300 }}>
                                        <Typography noWrap variant="body2">{inv.description}</Typography>
                                    </TableCell>
                                    <TableCell>{inv.categoryName}</TableCell>
                                    <TableCell
                                        sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                                        onClick={e => { e.stopPropagation(); navigate(`/profile/${inv.creatorId}`) }}
                                    >
                                        {inv.creatorName}
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