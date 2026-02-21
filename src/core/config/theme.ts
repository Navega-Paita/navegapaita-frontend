// src/core/config/theme.js
import { createTheme, type Theme } from '@mui/material/styles';

const theme: Theme = createTheme({
    palette: {
        primary: {
            main: '#005b9e', // Rojo Navega Paita
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#f6f4f0', // Crema/Beige
            contrastText: '#000000',
        },
        background: {
            default: '#ffffff',
            paper: '#f6f4f0',
        },
        text: {
            primary: '#000000',
            secondary: '#666666',
        },
        grey: {
            500: '#c4c4c4', // Copyright bar
        },
    },
    typography: {
        fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontFamily: 'Montserrat',
            fontWeight: 700, // Bold
        },
        h2: {
            fontFamily: 'Montserrat',
            fontWeight: 700,
        },
        h3: {
            fontFamily: 'Montserrat',
            fontWeight: 700,
        },
        h4: {
            fontFamily: 'Montserrat',
            fontWeight: 600,
        },
        h5: {
            fontFamily: 'Montserrat',
            fontWeight: 600,
        },
        h6: {
            fontFamily: 'Montserrat',
            fontWeight: 600,
        },
        subtitle1: {
            fontFamily: 'Montserrat',
            fontWeight: 500, // Medium
        },
        subtitle2: {
            fontFamily: 'Montserrat',
            fontWeight: 500,
        },
        body1: {
            fontFamily: 'Montserrat',
            fontWeight: 300, // Light
        },
        body2: {
            fontFamily: 'Montserrat',
            fontWeight: 300,
        },
        button: {
            fontFamily: 'Montserrat',
            fontWeight: 500,
            textTransform: 'none', // Evita mayúsculas automáticas
        },
        caption: {
            fontFamily: 'Montserrat',
            fontWeight: 300,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    borderBottom: '1px solid #e0e0e0',
                },
            },
        },
    },
});

export default theme;