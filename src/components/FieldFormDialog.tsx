import { useState, useEffect } from 'react'
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, FormControl, InputLabel, Select,
    MenuItem, FormControlLabel, Switch, Box
} from '@mui/material'
import type { FieldType, InventoryField, AddInventoryFieldRequest } from '../interfaces/inventoryField'

const FIELD_TYPES: FieldType[] = ['Text', 'MultilineText', 'Number', 'Link', 'Boolean']

interface Props {
    open: boolean
    onClose: () => void
    onSubmit: (data: AddInventoryFieldRequest) => Promise<void>
    initial?: InventoryField
}

export default function FieldFormDialog({ open, onClose, onSubmit, initial }: Props) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [type, setType] = useState<FieldType>('Text')
    const [isDisplayed, setIsDisplayed] = useState(true)

    useEffect(() => {
        if (initial) {
            setTitle(initial.title)
            setDescription(initial.description)
            setType(initial.type)
            setIsDisplayed(initial.isDisplayed)
        } else {
            setTitle('')
            setDescription('')
            setType('Text')
            setIsDisplayed(true)
        }
    }, [initial, open])

    const handleSubmit = async () => {
        await onSubmit({ title, description, type, isDisplayed })
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{initial ? 'Edit Field' : 'Add Field'}</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <TextField label="Title" value={title} onChange={e => setTitle(e.target.value)} fullWidth />
                    <TextField label="Description" value={description} onChange={e => setDescription(e.target.value)} fullWidth />
                    {!initial && (
                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select value={type} label="Type" onChange={e => setType(e.target.value as FieldType)}>
                                {FIELD_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                            </Select>
                        </FormControl>
                    )}
                    <FormControlLabel
                        control={<Switch checked={isDisplayed} onChange={e => setIsDisplayed(e.target.checked)} />}
                        label="Show in table"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={!title.trim()}>
                    {initial ? 'Save' : 'Add'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}