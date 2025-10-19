import { TextField, IconButton, Box } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

export function NumberInput({ cantidad, onChange } : { cantidad : number, onChange : (n : number) => void}) {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <IconButton size="small" onClick={() => onChange(Math.max(0, cantidad - 1))}>
        <Remove fontSize="small" />
      </IconButton>

      <TextField
        type="number"
        size="small"
        value={cantidad}
        onChange={(e) => onChange(Number(e.target.value))}
        sx={{
          width: '80px',
          '& input[type=number]': { 
            MozAppearance: 'textfield',
          },
          '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
            WebkitAppearance: 'none',
            margin: 0,
          },
          '& .MuiOutlinedInput-root fieldset': { border: 'none' },
        }}
        inputProps={{ min: 0 }}
      />

      <IconButton size="small" onClick={() => onChange(cantidad + 1)}>
        <Add fontSize="small" />
      </IconButton>
    </Box>
  );
}
