import { useEffect, useState } from 'react'
import {
    Box, Button, Typography, Select, MenuItem,
    TextField, Chip, Paper, FormControl, InputLabel,
    Alert, Divider, Tooltip, IconButton
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { api } from '../services/api'
import { getIdFormat, saveIdFormat } from '../services/idFormatService'
import type { IdElement, ElementType, SaveIdElementRequest } from '../interfaces/idFormat'

const ELEMENT_TYPES: { value: ElementType; label: string; description: string }[] = [
    { value: 'FixedText', label: 'Fixed Text', description: 'Static text, supports Unicode' },
    { value: 'Random6Digit', label: '6-digit random', description: 'e.g. 042931' },
    { value: 'Random9Digit', label: '9-digit random', description: 'e.g. 004829310' },
    { value: 'Random20Bit', label: '20-bit random', description: '0–1048575' },
    { value: 'Random32Bit', label: '32-bit random', description: '0–2147483647' },
    { value: 'Guid', label: 'GUID', description: 'e.g. A3F2C1D0...' },
    { value: 'DateTime', label: 'Date/Time', description: 'At moment of creation' },
    { value: 'Sequence', label: 'Sequence', description: 'Auto-incrementing number' },
]

interface Props { inventoryId: string }

export default function IdFormatBuilder({ inventoryId }: Props) {
    const [elements, setElements] = useState<IdElement[]>([])
    const [addType, setAddType] = useState<ElementType>('FixedText')
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        getIdFormat(api, inventoryId).then(f => {
            setElements(f.elements)
        })
    }, [inventoryId])

    const addElement = () => {
        if (elements.length >= 10) return
        const newEl: IdElement = {
            id: crypto.randomUUID(),
            type: addType,
            order: elements.length,
            padding: 0,
            text: addType === 'FixedText' ? '' : undefined,
            dateFormat: addType === 'DateTime' ? 'yyyyMMdd' : undefined,
        }
        setElements(prev => [...prev, newEl])
    }

    const removeElement = (id: string) => {
        setElements(prev => prev.filter(e => e.id !== id).map((e, i) => ({ ...e, order: i })))
    }

    const updateElement = (id: string, patch: Partial<IdElement>) => {
        setElements(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e))
    }

    const buildPreview = () => {
        return elements.map(el => {
            switch (el.type) {
                case 'FixedText': return el.text ?? ''
                case 'Random6Digit': return '042931'
                case 'Random9Digit': return '004829310'
                case 'Random20Bit': return '524288'
                case 'Random32Bit': return '1073741824'
                case 'Guid': return 'A3F2C1D0E5B4F789'
                case 'DateTime': return new Date().toISOString().slice(0, 10).replace(/-/g, '')
                case 'Sequence': return '1'
                default: return ''
            }
        }).join('')
    }

    const handleSave = async () => {
        setError('')
        try {
            const request: SaveIdElementRequest[] = elements.map(e => ({
                type: e.type,
                text: e.text,
                padding: e.padding,
                dateFormat: e.dateFormat,
            }))
            await saveIdFormat(api, inventoryId, { elements: request })
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
        } catch {
            setError('Failed to save format.')
        }
    }

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="body2" color="text.secondary">
                Define the format for automatically generated item IDs. Up to 10 elements.
            </Typography>

            {saved && <Alert severity="success">Format saved!</Alert>}
            {error && <Alert severity="error">{error}</Alert>}

            <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" mb={1}>Preview</Typography>
                <Typography fontFamily="monospace" fontSize={16}>
                    {buildPreview() || <span style={{ opacity: 0.4 }}>Add elements to see preview</span>}
                </Typography>
            </Paper>

            <Divider />

            <Box display="flex" gap={1} alignItems="center">
                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Element type</InputLabel>
                    <Select value={addType} label="Element type" onChange={e => setAddType(e.target.value as ElementType)}>
                        {ELEMENT_TYPES.map(t => (
                            <MenuItem key={t.value} value={t.value}>
                                <Tooltip title={t.description} placement="right">
                                    <span>{t.label}</span>
                                </Tooltip>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    startIcon={<AddIcon />}
                    variant="outlined"
                    onClick={addElement}
                    disabled={elements.length >= 10}
                >
                    Add
                </Button>
            </Box>

            {elements.map((el, idx) => (
                <Paper key={el.id} variant="outlined" sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="caption" color="text.secondary">#{idx + 1}</Typography>
                        <Chip label={ELEMENT_TYPES.find(t => t.value === el.type)?.label} size="small" />
                        <Box flexGrow={1} />
                        <IconButton size="small" color="error" onClick={() => removeElement(el.id)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    {el.type === 'FixedText' && (
                        <TextField
                            label="Text"
                            value={el.text ?? ''}
                            onChange={e => updateElement(el.id, { text: e.target.value })}
                            size="small"
                            fullWidth
                        />
                    )}

                    {el.type === 'DateTime' && (
                        <TextField
                            label="Date format"
                            value={el.dateFormat ?? 'yyyyMMdd'}
                            onChange={e => updateElement(el.id, { dateFormat: e.target.value })}
                            size="small"
                            helperText="e.g. yyyyMMdd, yyyy-MM-dd, HHmmss"
                            fullWidth
                        />
                    )}

                    {['Random20Bit', 'Random32Bit', 'Random6Digit', 'Random9Digit', 'Sequence'].includes(el.type) && (
                        <TextField
                            label="Padding (leading zeros)"
                            type="number"
                            value={el.padding}
                            onChange={e => updateElement(el.id, { padding: Number(e.target.value) })}
                            size="small"
                            inputProps={{ min: 0, max: 20 }}
                            helperText="0 = no padding"
                        />
                    )}
                </Paper>
            ))}

            <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" onClick={handleSave} disabled={elements.length === 0}>
                    Save Format
                </Button>
            </Box>
        </Box>
    )
}