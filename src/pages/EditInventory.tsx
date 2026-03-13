import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Container, Typography, Box, Paper, Tabs, Tab,
    TextField, Button, FormControlLabel, Switch,
    FormControl, InputLabel, Select, MenuItem,
    Chip, CircularProgress, Alert
} from '@mui/material'
import Navbar from '../components/Navbar'
import FieldFormDialog from '../components/FieldFormDialog'
import IdFormatBuilder from '../components/IdFormatBuilder'
import { api } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { getInventoryById, updateInventory } from '../services/inventoryService'
import { getInventoryFields, addInventoryField, updateInventoryField, deleteInventoryField } from '../services/inventoryFieldService'
import { categoryService } from '../services/categoryService'
import type { InventoryDetail } from '../interfaces/inventory'
import type { InventoryField, AddInventoryFieldRequest } from '../interfaces/inventoryField'
import type { Category } from '../interfaces/category'
import {
    Table, TableHead, TableRow, TableCell, TableBody,
    IconButton, Tooltip
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

export default function EditInventory() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const user = useAuthStore(s => s.user)

    const [inventory, setInventory] = useState<InventoryDetail | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [fields, setFields] = useState<InventoryField[]>([])
    const [tab, setTab] = useState(0)
    const [error, setError] = useState('')
    const [saved, setSaved] = useState(false)

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [isPublic, setIsPublic] = useState(false)
    const [categoryId, setCategoryId] = useState('')

    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingField, setEditingField] = useState<InventoryField | undefined>()

    useEffect(() => {
        Promise.all([
            getInventoryById(api, id!),
            categoryService.getAll(),
            getInventoryFields(api, id!)
        ]).then(([inv, cats, flds]) => {
            setInventory(inv)
            setCategories(cats)
            setFields(flds)
            setTitle(inv.title)
            setDescription(inv.description)
            setImageUrl(inv.imageUrl)
            setIsPublic(inv.isPublic)
            const cat = cats.find(c => c.name === inv.categoryName)
            if (cat) setCategoryId(cat.id)
        })
    }, [id])

    const isOwner = user?.id === inventory?.creatorId || user?.isAdmin

    useEffect(() => {
        if (inventory && !isOwner) navigate(`/inventories/${id}`)
    }, [inventory, isOwner])

    const handleSave = async () => {
        setError('')
        try {
            await updateInventory(api, id!, { title, description, imageUrl, isPublic, categoryId })
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
        } catch {
            setError('Failed to save changes.')
        }
    }

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

    if (!inventory) return (
        <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>
    )

    return (
        <>
            <Navbar />
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5" fontWeight={700}>Edit Inventory</Typography>
                    <Button variant="text" onClick={() => navigate(`/inventories/${id}`)}>
                        ← Back
                    </Button>
                </Box>

                <Paper>
                    <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tab label="General" />
                        <Tab label="Custom ID" />
                        <Tab label="Fields" />
                    </Tabs>

                    <Box p={3}>
                        {tab === 0 && (
                            <Box display="flex" flexDirection="column" gap={2}>
                                {error && <Alert severity="error">{error}</Alert>}
                                {saved && <Alert severity="success">Saved!</Alert>}
                                <TextField label="Title" value={title} onChange={e => setTitle(e.target.value)} fullWidth />
                                <TextField label="Description" value={description} onChange={e => setDescription(e.target.value)} multiline rows={4} fullWidth />
                                <TextField label="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} fullWidth />
                                <FormControl fullWidth>
                                    <InputLabel>Category</InputLabel>
                                    <Select value={categoryId} label="Category" onChange={e => setCategoryId(e.target.value)}>
                                        {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <FormControlLabel
                                    control={<Switch checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />}
                                    label="Public"
                                />
                                <Box display="flex" justifyContent="flex-end">
                                    <Button variant="contained" onClick={handleSave}>Save</Button>
                                </Box>
                            </Box>
                        )}

                        {tab === 1 && <IdFormatBuilder inventoryId={id!} />}

                        {tab === 2 && (
                            <Box>
                                <Button startIcon={<AddIcon />} variant="contained" size="small"
                                        onClick={() => { setEditingField(undefined); setDialogOpen(true) }} sx={{ mb: 2 }}>
                                    Add Field
                                </Button>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Show in table</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {fields.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5}>
                                                    <Typography variant="body2" color="text.secondary">No fields yet.</Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {fields.map(f => (
                                            <TableRow key={f.id}>
                                                <TableCell>{f.title}</TableCell>
                                                <TableCell><Chip label={f.type} size="small" variant="outlined" /></TableCell>
                                                <TableCell>{f.description}</TableCell>
                                                <TableCell>{f.isDisplayed ? 'Yes' : 'No'}</TableCell>
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
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        )}
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