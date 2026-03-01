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
    Dashboard,
    DirectionsBoat,
    People,
    MonitorHeart,
} from '@mui/icons-material';
import { useAuth } from "../../../core/context/AuthContext.tsx";

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
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
    color: 'white',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'white',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        '&::placeholder': {
            color: alpha(theme.palette.common.white, 0.7),
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

// Mapeo de iconos por path para el drawer
const navIconMap: Record<string, JSX.Element> = {
    '/buscar': <SearchIcon />,
    '/sobre-paita': <Phone />,
    '/dashboard': <Dashboard />,
    '/embarcaciones': <DirectionsBoat />,
    '/usuarios': <People />,
    '/monitoreo': <MonitorHeart />,
};

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

    const getNavLinks = () => {
        const role = user?.role;

        if (role === 'ADMIN') {
            return [
                { text: 'Dashboard', path: '/dashboard' },
                { text: 'Embarcaciones', path: '/embarcaciones' },
                { text: 'Usuarios', path: '/usuarios' },
                { text: 'Monitoreo', path: '/monitoreo' },
            ];
        }

        if (role === 'OPERATOR') {
            return [
                { text: 'Dashboard', path: '/dashboard' },
                { text: 'Embarcaciones', path: '/embarcaciones' },
                { text: 'Monitoreo', path: '/monitoreo' },
            ];
        }

        // FISHERMAN o no autenticado
        return [
            { text: 'Experiencias', path: '/buscar' },
            { text: 'Sobre Paita', path: '/sobre-paita' },
        ];
    };

    const navLinks = getNavLinks();

    // ¿Mostrar barra de búsqueda? Solo para FISHERMAN o no autenticados
    const showSearch = !user?.role || user.role === 'FISHERMAN';

    // ¿Mostrar iconos de wishlist/contacto? Solo para FISHERMAN o no autenticados
    const showPublicIcons = !user?.role || user.role === 'FISHERMAN';

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

    const navLinkStyle = {
        fontWeight: 500,
        color: 'white',
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

            {/* Nav links dinámicos según rol */}
            <List>
                {navLinks.map((link) => (
                    <ListItem key={link.path} disablePadding>
                        <ListItemButton onClick={() => { navigate(link.path); setDrawerOpen(false); }}>
                            <ListItemIcon sx={{ color: '#0d47a1' }}>
                                {navIconMap[link.path] ?? <ChevronRight />}
                            </ListItemIcon>
                            <ListItemText primary={link.text} />
                            <ChevronRight />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Acciones secundarias */}
            <List>
                {showPublicIcons && (
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => { navigate('/wishlist'); setDrawerOpen(false); }}>
                            <ListItemIcon sx={{ color: '#0d47a1' }}><FavoriteBorder /></ListItemIcon>
                            <ListItemText primary="Lista de deseo" />
                        </ListItemButton>
                    </ListItem>
                )}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate(accountPath); setDrawerOpen(false); }}>
                        <ListItemIcon sx={{ color: '#0d47a1' }}><AccountCircle /></ListItemIcon>
                        <ListItemText primary={isAuthenticated ? 'Mi Perfil' : 'Iniciar Sesión'} />
                    </ListItemButton>
                </ListItem>
                {showPublicIcons && (
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => { navigate('/contacto'); setDrawerOpen(false); }}>
                            <ListItemIcon sx={{ color: '#0d47a1' }}><Phone /></ListItemIcon>
                            <ListItemText primary="Contáctanos" />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    backgroundColor: '#0d47a1',
                    color: 'white'
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    {isMobile ? (
                        <>
                            {showSearch && (
                                <IconButton onClick={handleSearchToggle} sx={{ color: 'white' }}>
                                    <SearchIcon />
                                </IconButton>
                            )}

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

                            {/* Nav links dinámicos en desktop */}
                            <Box sx={{ display: 'flex', gap: 4, flexGrow: 1, alignItems: 'center' }}>
                                {navLinks.map((link) => (
                                    <Typography
                                        key={link.path}
                                        component={Link}
                                        to={link.path}
                                        sx={navLinkStyle}
                                    >
                                        {link.text}
                                    </Typography>
                                ))}
                            </Box>

                            {showSearch && (
                                <Search>
                                    <SearchIconWrapper>
                                        <SearchIcon />
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        placeholder="Buscar experiencias..."
                                        inputProps={{ 'aria-label': 'search' }}
                                    />
                                </Search>
                            )}

                            <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                                {showPublicIcons && (
                                    <>
                                        <IconButton component={Link} to="/wishlist" sx={{ color: 'white' }}>
                                            <FavoriteBorder />
                                        </IconButton>
                                        <IconButton component={Link} to="/contacto" sx={{ color: 'white' }}>
                                            <Phone />
                                        </IconButton>
                                    </>
                                )}
                                <IconButton component={Link} to={accountPath} sx={{ color: 'white' }}>
                                    <AccountCircle />
                                </IconButton>
                            </Box>
                        </>
                    )}
                </Toolbar>

                {isMobile && searchOpen && showSearch && (
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