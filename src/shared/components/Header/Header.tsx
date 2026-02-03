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

// Styled Components tipados (heredan tipos de MUI automáticamente)
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.05),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.black, 0.1),
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
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
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

    // Estados tipados por inferencia
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [searchOpen, setSearchOpen] = useState<boolean>(false);

    // Tipado de eventos para el Drawer (estándar de MUI)
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

    const drawerContent = (
        <Box sx={{ width: 300 }} role="presentation">
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Paita<span style={{ fontWeight: 700 }}>Paita</span>
                </Typography>
                <IconButton onClick={toggleDrawer(false)}>
                    <Close />
                </IconButton>
            </Box>

            <Divider />

            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/destinos'); setDrawerOpen(false); }}>
                        <ListItemText primary="Destinos" />
                        <ChevronRight />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate('/sobre-paita'); setDrawerOpen(false); }}>
                        <ListItemText primary="Sobre paita" />
                        <ChevronRight />
                    </ListItemButton>
                </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            <List>
                {[
                    { text: 'Lista de deseo', icon: <FavoriteBorder />, path: '/wishlist' },
                    { text: 'Mi Perfil', icon: <AccountCircle />, path: '/perfil' },
                    { text: 'Contactanos', icon: <Phone />, path: '/contacto' },
                ].map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton onClick={() => { navigate(item.path); setDrawerOpen(false); }}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    {isMobile ? (
                        <>
                            <IconButton onClick={handleSearchToggle} sx={{ color: 'text.primary' }}>
                                <SearchIcon />
                            </IconButton>

                            <Typography
                                variant="h6"
                                component={Link}
                                to="/"
                                sx={{
                                    fontWeight: 600,
                                    color: 'primary.main',
                                    textDecoration: 'none',
                                    flexGrow: 1,
                                    textAlign: 'center',
                                }}
                            >
                                NavegaPaita
                            </Typography>

                            <IconButton onClick={toggleDrawer(true)} sx={{ color: 'text.primary' }}>
                                <MenuIcon />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <Typography
                                variant="h6"
                                component={Link}
                                to="/"
                                sx={{ fontWeight: 600, color: 'primary.main', textDecoration: 'none', mr: 4 }}
                            >
                                NavegaPaita
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 3, flexGrow: 1 }}>
                                <Typography
                                    component={Link}
                                    to="/destinos"
                                    sx={{ fontWeight: 500, color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                                >
                                    Destinos
                                </Typography>
                                <Typography
                                    component={Link}
                                    to="/sobre-paita"
                                    sx={{ fontWeight: 500, color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                                >
                                    Sobre paita
                                </Typography>
                            </Box>

                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Buscar"
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </Search>

                            <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                                {/* En TS, cuando usamos component={Link}, a veces el prop 'to' necesita un cast rápido */}
                                <IconButton component={Link} to={"/wishlist"} sx={{ color: 'text.primary' }}>
                                    <FavoriteBorder />
                                </IconButton>
                                <IconButton component={Link} to={"/perfil"} sx={{ color: 'text.primary' }}>
                                    <AccountCircle />
                                </IconButton>
                                <IconButton component={Link} to={"/contacto"} sx={{ color: 'text.primary' }}>
                                    <Phone />
                                </IconButton>
                            </Box>
                        </>
                    )}
                </Toolbar>

                {isMobile && searchOpen && (
                    <Box sx={{ px: 2, pb: 2 }}>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Buscar destino"
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