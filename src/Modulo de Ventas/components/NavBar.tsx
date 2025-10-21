import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import type { Theme } from '@emotion/react';
import type { SxProps } from '@mui/material';
import { useNavigate } from 'react-router-dom';


type NavBarProps = {
    pages : string[]
} 

export function NavBar( { pages } : NavBarProps ) {

    const navigate = useNavigate() 

    return (
        <AppBar position="static" color='transparent' >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography variant="h4" noWrap component="a" href="/ventas" sx={{...logoStyle, color: location.pathname === '/ventas' ? 'primary.main' : 'black' }}>
                        Módulo Ventas
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: { md: '8px' } }}>
                        {pages.map((page) => {
                            const path = `/ventas/${page.toLowerCase()}`;
                            const isSelected = location.pathname === path;
                            return (
                                <Button
                                    key={page}                    
                                    sx={{ my: 2, fontSize: '16px' ,  color: isSelected ? 'primary.main' : 'black', display: 'block' }}
                                    onClick={() => {navigate(page.toLocaleLowerCase())}}
                                >
                                    {page}
                                </Button>
                            )
                        })}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
  );
}


const logoStyle : SxProps<Theme> = {
    mr: 6,
    display: { xs: 'none', md: 'flex' },
    fontWeight: 600,
    letterSpacing: '.2rem',
    color: 'inherit',
    textDecoration: 'none',
}