import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Typography, Box, CircularProgress } from '@mui/material'
import Navbar from '../components/Navbar'
import ItemForm from '../components/ItemForm'
import { api } from '../services/api'
import { getItems, updateItem } from '../services/itemService'
import { getInventoryFields } from '../services/inventoryFieldService'
import type { InventoryField } from '../interfaces/inventoryField'
import type { Item } from '../interfaces/item'

export default function EditItem() {
    const { id, itemId } = useParams<{ id: string; itemId: string }>()
    const navigate = useNavigate()
    const [fields, setFields] = useState<InventoryField[]>([])
    const [item, setItem] = useState<Item | null>(null)

    useEffect(() => {
        Promise.all([
            getInventoryFields(api, id!),
            getItems(api, id!)
        ]).then(([f, items]) => {
            setFields(f)
            setItem(items.find(i => i.id === itemId) ?? null)
        })
    }, [id, itemId])

    const handleSubmit = async (customId: string, fieldValues: { fieldId: string; value: string }[]) => {
        await updateItem(api, id!, itemId!, { customId, fieldValues })
        navigate(`/inventories/${id}`)
    }

    if (!item) return (
        <>
            <Navbar />
            <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>
        </>
    )

    return (
        <>
            <Navbar />
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Box mb={3}>
                    <Typography variant="h5" fontWeight={700}>Edit Item</Typography>
                </Box>
                <ItemForm
                    fields={fields}
                    initial={item}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate(`/inventories/${id}`)}
                />
            </Container>
        </>
    )
}