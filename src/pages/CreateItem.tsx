import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Typography, Box } from '@mui/material'
import Navbar from '../components/Navbar'
import ItemForm from '../components/ItemForm'
import { api } from '../services/api'
import { createItem } from '../services/itemService'
import { getInventoryFields } from '../services/inventoryFieldService'
import type { InventoryField } from '../interfaces/inventoryField'

export default function CreateItem() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [fields, setFields] = useState<InventoryField[]>([])

    useEffect(() => {
        getInventoryFields(api, id!).then(setFields)
    }, [id])

    const handleSubmit = async (_customId: string, fieldValues: { fieldId: string; value: string }[]) => {
        await createItem(api, id!, { fieldValues })
        navigate(`/inventories/${id}`)
    }

    return (
        <>
            <Navbar />
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Box mb={3}>
                    <Typography variant="h5" fontWeight={700}>Add Item</Typography>
                </Box>
                <ItemForm
                    fields={fields}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate(`/inventories/${id}`)}
                />
            </Container>
        </>
    )
}