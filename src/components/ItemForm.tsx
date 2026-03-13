import {useState} from 'react'
import {
    Box, TextField, Button, Typography, Checkbox,
    FormControlLabel, Paper
} from '@mui/material'
import type {InventoryField} from '../interfaces/inventoryField'
import type {Item} from '../interfaces/item'

interface Props {
    fields: InventoryField[]
    initial?: Item
    onSubmit: (customId: string, fieldValues: { fieldId: string; value: string }[]) => Promise<void>
    onCancel: () => void
}

function initValues(fields: InventoryField[], initial?: Item): Record<string, string> {
    const init: Record<string, string> = {}
    fields.forEach(f => {
        const existing = initial?.fieldValues.find(fv => fv.fieldId === f.id)
        init[f.id] = existing?.value ?? (f.type === 'Boolean' ? 'false' : '')
    })
    return init
}

export default function ItemForm({fields, initial, onSubmit, onCancel}: Props) {
    const [customId, setCustomId] = useState(initial?.customId ?? '')
    const [values, setValues] = useState<Record<string, string>>(() => initValues(fields, initial))

    const handleChange = (fieldId: string, value: string) => {
        setValues(prev => ({...prev, [fieldId]: value}))
    }

    const handleSubmit = async () => {
        const fieldValues = fields.map(f => ({fieldId: f.id, value: values[f.id] ?? ''}))
        await onSubmit(customId, fieldValues)
    }

    const renderField = (field: InventoryField) => {
        const value = values[field.id] ?? ''
        if (field.type === 'Boolean') {
            return (
                <FormControlLabel
                    key={field.id}
                    control={
                        <Checkbox
                            checked={value === 'true'}
                            onChange={e => handleChange(field.id, e.target.checked ? 'true' : 'false')}
                        />
                    }
                    label={field.title}
                />
            )
        }
        return (
            <TextField
                key={field.id}
                label={field.title}
                helperText={field.description}
                value={value}
                onChange={e => handleChange(field.id, e.target.value)}
                multiline={field.type === 'MultilineText'}
                rows={field.type === 'MultilineText' ? 3 : undefined}
                type={field.type === 'Number' ? 'number' : 'text'}
                fullWidth
            />
        )
    }

    return (
        <Paper sx={{p: 3}}>
            <Box display="flex" flexDirection="column" gap={2}>
                {initial && (
                    <TextField
                        label="Custom ID"
                        value={customId}
                        onChange={e => setCustomId(e.target.value)}
                        fullWidth
                    />
                )}
                {fields.length > 0 && (
                    <Typography variant="subtitle2" color="text.secondary">Fields</Typography>
                )}
                {fields.map(renderField)}
                <Box display="flex" gap={1} justifyContent="flex-end">
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit} disabled={initial ? !customId.trim() : false}>
                        {initial ? 'Save' : 'Create'}
                    </Button>
                </Box>
            </Box>
        </Paper>
    )
}