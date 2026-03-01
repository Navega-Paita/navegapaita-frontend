import { useState, type KeyboardEvent, type MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    InputBase,
    useTheme,
    useMediaQuery,
    styled,
    alpha,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Search as SearchIcon,
    FavoriteBorder,
    AccountCircle,
    Phone,
    ChevronRight,
    Close,
} from '@mui/icons-material';
import {useAuth} from "../../../core/context/AuthContext.tsx";

// 1. Buscador adaptado al fondo oscuro (blanco traslúcido)
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15), // Blanco traslúcido
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white', // Icono blanco
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'white', // Texto blanco
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        '&::placeholder': {
            color: alpha(theme.palette.common.white, 0.7), // Placeholder legible
            opacity: 1,
        },
        [theme.breakpoints.up('sm')]: {
            width: '20ch',
            '&:focus': {
                width: '30ch',
            },
        },
    },
}));

export default function Header() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const accountPath = isAuthenticated
        ? (user?.role === 'FISHERMAN' ? '/profile' : '/perfil')
        : '/login';

    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [searchOpen, setSearchOpen] = useState<boolean>(false);

    const toggleDrawer = (open: boolean) => (event: KeyboardEvent | MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as KeyboardEvent).key === 'Tab' || (event as KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setDrawerOpen(open);
    };

    const handleSearchToggle = (): void => {
        setSearchOpen(!searchOpen);
    };

    // Estilo común para los links de navegación
    const navLinkStyle = {
        fontWeight: 500,
        color: 'white', // Texto en blanco
        textDecoration: 'none',
        fontSize: '0.95rem',
        '&:hover': { opacity: 0.8 }
    };

    const drawerContent = (
        <Box sx={{ width: 300 }} role="presentation">
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0d47a1' }}>
                    Navega<span style={{ fontWeight: 800 }}>Paita</span>
                </Typography>
                <IconButton onClick={toggleDrawer(false)}>
                    <Close />
                </IconButton>
            </Box>

            <Divider />

            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/buscar'); setDrawerOpen(false); }}>
                        <ListItemText primary="Experiencias" />
                        <ChevronRight />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/sobre-paita'); setDrawerOpen(false); }}>
                        <ListItemText primary="Sobre Paita" />
                        <ChevronRight />
                    </ListItemButton>
                </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            <List>
                {[
                    { text: 'Lista de deseo', icon: <FavoriteBorder />, path: '/wishlist' },
                    {
                        text: isAuthenticated ? 'Mi Perfil' : 'Iniciar Sesión',
                        icon: <AccountCircle />,
                        path: accountPath
                    },
                    { text: 'Contáctanos', icon: <Phone />, path: '/contacto' },
                ].map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton onClick={() => { navigate(item.path); setDrawerOpen(false); }}>
                            <ListItemIcon sx={{ color: '#0d47a1' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    backgroundColor: '#0d47a1', // Azul Turismocity
                    color: 'white' // Asegura que iconos hereden blanco
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    {isMobile ? (
                        <>
                            <IconButton onClick={handleSearchToggle} sx={{ color: 'white' }}>
                                <SearchIcon />
                            </IconButton>

                            <Typography
                                variant="h6"
                                component={Link}
                                to="/"
                                sx={{
                                    fontWeight: 700,
                                    color: 'white',
                                    textDecoration: 'none',
                                    flexGrow: 1,
                                    textAlign: 'center',
                                    letterSpacing: 1
                                }}
                            >
                                NAVEGAPAITA
                            </Typography>

                            <IconButton onClick={toggleDrawer(true)} sx={{ color: 'white' }}>
                                <MenuIcon />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <Typography
                                variant="h6"
                                component={Link}
                                to="/"
                                sx={{
                                    fontWeight: 800,
                                    color: 'white',
                                    textDecoration: 'none',
                                    mr: 4,
                                    letterSpacing: 1
                                }}
                            >
                                NAVEGAPAITA
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 4, flexGrow: 1, alignItems: 'center' }}>
                                <Typography component={Link} to="/buscar" sx={navLinkStyle}>
                                    Experiencias
                                </Typography>
                                <Typography component={Link} to="/sobre-paita" sx={navLinkStyle}>
                                    Sobre Paita
                                </Typography>
                            </Box>

                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Buscar experiencias..."
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </Search>

                            <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                                <IconButton component={Link} to="/wishlist" sx={{ color: 'white' }}>
                                    <FavoriteBorder />
                                </IconButton>
                                <IconButton component={Link} to={accountPath} sx={{ color: 'white' }}>
                                    <AccountCircle />
                                </IconButton>
                                <IconButton component={Link} to="/contacto" sx={{ color: 'white' }}>
                                    <Phone />
                                </IconButton>
                            </Box>
                        </>
                    )}
                </Toolbar>

                {isMobile && searchOpen && (
                    <Box sx={{ px: 2, pb: 2, backgroundColor: '#0d47a1' }}>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="¿A dónde quieres ir?"
                                inputProps={{ 'aria-label': 'search' }}
                                autoFocus
                            />
                        </Search>
                    </Box>
                )}
            </AppBar>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                {drawerContent}
            </Drawer>
        </>
    );
}