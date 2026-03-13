import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Container, Typography, Box, Paper, Tabs, Tab,
    Table, TableHead, TableRow, TableCell, TableBody,
    IconButton, Button, Chip, Tooltip
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import Navbar from '../components/Navbar'
import FieldFormDialog from '../components/FieldFormDialog'
import { api } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { getInventoryFields, addInventoryField, updateInventoryField, deleteInventoryField } from '../services/inventoryFieldService'
import { getItems, deleteItem } from '../services/itemService'
import type { InventoryField, AddInventoryFieldRequest } from '../interfaces/inventoryField'
import type { Item } from '../interfaces/item'

interface InventoryDetail {
    id: string
    title: string
    description: string
    imageUrl: string
    isPublic: boolean
    creatorId: string
    creatorName: string
    categoryName: string
    itemsCount: number
    tags: string[]
    fields: InventoryField[]
}

export default function InventoryDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const user = useAuthStore(s => s.user)
    const [inventory, setInventory] = useState<InventoryDetail | null>(null)
    const [fields, setFields] = useState<InventoryField[]>([])
    const [items, setItems] = useState<Item[]>([])
    const [tab, setTab] = useState(0)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingField, setEditingField] = useState<InventoryField | undefined>()

    const isOwner = user?.id === inventory?.creatorId || user?.isAdmin
    const canWrite = isOwner || inventory?.isPublic

    useEffect(() => {
        api.get<InventoryDetail>(`/api/inventories/${id}`).then(r => setInventory(r.data))
        getInventoryFields(api, id!).then(setFields)
        getItems(api, id!).then(setItems)
    }, [id])

    const displayedFields = fields.filter(f => f.isDisplayed)

    const handleAddField = async (data: AddInventoryFieldRequest) => {
        const fieldId = await addInventoryField(api, id!, data)
        setFields(prev => [...prev, { id: fieldId, ...data }])
    }

    const handleEditField = async (data: AddInventoryFieldRequest) => {
        if (!editingField) return
        await updateInventoryField(api, id!, editingField.id, data)
        setFields(prev => prev.map(f => f.id === editingField.id ? { ...f, ...data } : f))
    }

    const handleDeleteField = async (fieldId: string) => {
        await deleteInventoryField(api, id!, fieldId)
        setFields(prev => prev.filter(f => f.id !== fieldId))
    }

    const handleDeleteItem = async (itemId: string) => {
        await deleteItem(api, id!, itemId)
        setItems(prev => prev.filter(i => i.id !== itemId))
    }

    if (!inventory) return null

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>{inventory.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {inventory.categoryName} · by {inventory.creatorName}
                        </Typography>
                        <Box display="flex" gap={0.5} mt={1} flexWrap="wrap">
                            {inventory.tags.map(t => <Chip key={t} label={t} size="small" />)}
                        </Box>
                    </Box>
                    {isOwner && (
                        <Button variant="outlined" onClick={() => navigate(`/inventories/${id}/edit`)}>
                            Edit Inventory
                        </Button>
                    )}
                </Box>

                <Paper>
                    <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tab label={`Items (${items.length})`} />
                        <Tab label="Fields" />
                        <Tab label="Discussion" />
                    </Tabs>

                    <Box p={2}>
                        {tab === 0 && (
                            <Box>
                                {canWrite && (
                                    <Button startIcon={<AddIcon />} variant="contained" size="small"
                                            onClick={() => navigate(`/inventories/${id}/items/create`)} sx={{ mb: 2 }}>
                                        Add Item
                                    </Button>
                                )}
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            {displayedFields.map(f => <TableCell key={f.id}>{f.title}</TableCell>)}
                                            <TableCell>Created by</TableCell>
                                            {canWrite && <TableCell align="right">Actions</TableCell>}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {items.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={displayedFields.length + 3}>
                                                    <Typography variant="body2" color="text.secondary">No items yet.</Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {items.map(item => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.customId}</TableCell>
                                                {displayedFields.map(f => {
                                                    const fv = item.fieldValues.find(v => v.fieldId === f.id)
                                                    return (
                                                        <TableCell key={f.id}>
                                                            {f.type === 'Boolean'
                                                                ? (fv?.value === 'true' ? '✓' : '✗')
                                                                : (fv?.value ?? '—')}
                                                        </TableCell>
                                                    )
                                                })}
                                                <TableCell>{item.creatorName}</TableCell>
                                                {canWrite && (
                                                    <TableCell align="right">
                                                        <Tooltip title="Edit">
                                                            <IconButton size="small" onClick={() => navigate(`/inventories/${id}/items/${item.id}/edit`)}>
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete">
                                                            <IconButton size="small" color="error" onClick={() => handleDeleteItem(item.id)}>
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        )}

                        {tab === 1 && (
                            <Box>
                                {isOwner && (
                                    <Button startIcon={<AddIcon />} variant="contained" size="small"
                                            onClick={() => { setEditingField(undefined); setDialogOpen(true) }} sx={{ mb: 2 }}>
                                        Add Field
                                    </Button>
                                )}
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Show in table</TableCell>
                                            {isOwner && <TableCell align="right">Actions</TableCell>}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {fields.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5}>
                                                    <Typography color="text.secondary" variant="body2">No fields yet.</Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {fields.map(f => (
                                            <TableRow key={f.id}>
                                                <TableCell>{f.title}</TableCell>
                                                <TableCell><Chip label={f.type} size="small" variant="outlined" /></TableCell>
                                                <TableCell>{f.description}</TableCell>
                                                <TableCell>{f.isDisplayed ? 'Yes' : 'No'}</TableCell>
                                                {isOwner && (
                                                    <TableCell align="right">
                                                        <Tooltip title="Edit">
                                                            <IconButton size="small" onClick={() => { setEditingField(f); setDialogOpen(true) }}>
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete">
                                                            <IconButton size="small" color="error" onClick={() => handleDeleteField(f.id)}>
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        )}

                        {tab === 2 && <Typography color="text.secondary">Discussion coming soon…</Typography>}
                    </Box>
                </Paper>
            </Container>

            <FieldFormDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSubmit={editingField ? handleEditField : handleAddField}
                initial={editingField}
            />
        </>
    )
}