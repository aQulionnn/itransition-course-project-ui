import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {
    Container, Typography, Box, TextField, Button,
    FormControlLabel, Switch, MenuItem, Select,
    InputLabel, FormControl, Chip, Paper
} from '@mui/material'
import Navbar from '../components/Navbar'
import {createInventory} from '../services/inventoryService'
import {categoryService} from '../services/categoryService'
import type {Category} from '../interfaces/category'
import {api} from "../services/api.ts";

export default function CreateInventory() {
    const navigate = useNavigate()
    const [categories, setCategories] = useState<Category[]>([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [isPublic, setIsPublic] = useState(false)
    const [categoryId, setCategoryId] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')

    useEffect(() => {
        categoryService.getAll().then(setCategories)
    }, [])

    const addTag = () => {
        const trimmed = tagInput.trim()
        if (trimmed && !tags.includes(trimmed)) {
            setTags(prev => [...prev, trimmed])
        }
        setTagInput('')
    }

    const removeTag = (tag: string) => {
        setTags(prev => prev.filter(t => t !== tag))
    }

    const submit = async () => {
        const id = await createInventory(api, {
            title, description, imageUrl, isPublic, categoryId, tags
        })
        navigate(`/inventories/${id}`)
    }

    return (
        <>
            <Navbar/>
            <Container maxWidth="md" sx={{mt: 4}}>
                <Typography variant="h5" mb={3}>Create Inventory</Typography>
                <Paper sx={{p: 3}}>
                    <Box display="flex" flexDirection="column" gap={3}>
                        <TextField
                            label="Title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            multiline
                            rows={4}
                            fullWidth
                        />
                        <TextField
                            label="Image URL"
                            value={imageUrl}
                            onChange={e => setImageUrl(e.target.value)}
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={categoryId}
                                label="Category"
                                onChange={e => setCategoryId(e.target.value)}
                            >
                                {categories.map(c => (
                                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={<Switch checked={isPublic} onChange={e => setIsPublic(e.target.checked)}/>}
                            label="Public"
                        />
                        <Box>
                            <Box display="flex" gap={1} mb={1}>
                                <TextField
                                    label="Add tag"
                                    value={tagInput}
                                    onChange={e => setTagInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && addTag()}
                                    size="small"
                                />
                                <Button variant="outlined" onClick={addTag}>Add</Button>
                            </Box>
                            <Box display="flex" gap={0.5} flexWrap="wrap">
                                {tags.map(tag => (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onDelete={() => removeTag(tag)}
                                        size="small"
                                    />
                                ))}
                            </Box>
                        </Box>
                        <Button variant="contained" onClick={submit} size="large">
                            Create
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </>
    )
}