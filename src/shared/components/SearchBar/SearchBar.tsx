import { useState, type ChangeEvent, type MouseEvent } from 'react';
import {
    Box,
    TextField,
    InputAdornment,
    Button,
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Popper,
    ClickAwayListener,
    ListItemButton
} from '@mui/material';
import {
    LocationOn as LocationIcon,
    Search as SearchIcon,
    Clear as ClearIcon,

} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import './SearchBar.css';
import {CalendarIcon} from "@mui/x-date-pickers";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const MOCK_SUGGESTIONS: string[] = [
    'Peru',
    'Peru and bolivia',
    'Peru premium',
    'Peru and galapagos',
    'Peru essentials'
];

export default function SearchBar() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState<string>('');
    // Tipamos las fechas como Date o null
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

    // El ancla del Popper debe ser un HTMLElement o null
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const [openStart, setOpenStart] = useState<boolean>(false);
    const [openEnd, setOpenEnd] = useState<boolean>(false);

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        setSearchQuery(value);
        setAnchorEl(event.currentTarget);

        if (value.length > 0) {
            const filtered = MOCK_SUGGESTIONS.filter(suggestion =>
                suggestion.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: string): void => {
        setSearchQuery(suggestion);
        setShowSuggestions(false);
    };

    const handleClearSearch = (e: MouseEvent<HTMLButtonElement>): void => {
        e.stopPropagation();
        setSearchQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleSearch = (): void => {
        const params = new URLSearchParams();

        params.set('page', '1');

        if (searchQuery.trim()) {
            params.set('keyword', searchQuery.trim());
        }

        if (startDate) {
            params.set('date_range_from', format(startDate, 'yyyy-MM-dd'));
        }

        if (endDate) {
            params.set('date_range_to', format(endDate, 'yyyy-MM-dd'));
        }

        navigate({
            pathname: '/buscar',
            search: `?${params.toString()}`
        });
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Box className="search-bar-container">

                <ClickAwayListener onClickAway={() => setShowSuggestions(false)}>
                    <Box sx={{ position: 'relative', flex: 1 }}>
                        <TextField
                            fullWidth
                            variant="standard"
                            placeholder="¿A dónde quieres ir?"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            InputProps={{
                                disableUnderline: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LocationIcon sx={{ color: '#ff2828', mr: 1 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: searchQuery && (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={handleClearSearch}>
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: { fontSize: '15px', fontWeight: 500 }
                            }}
                        />

                        <Popper
                            open={showSuggestions}
                            anchorEl={anchorEl}
                            placement="bottom-start"
                            sx={{ zIndex: 1300, width: anchorEl?.offsetWidth }}
                        >
                            <Paper elevation={3} sx={{ mt: 1, borderRadius: '12px', overflow: 'hidden' }}>
                                <List sx={{ py: 0 }}>
                                    <ListItem sx={{ py: 1.5, px: 2, backgroundColor: '#ffffff', borderBottom: '1px solid #e0e0e0' }}>
                                        <ListItemText
                                            primary="BÚSQUEDAS SUGERIDAS"
                                            primaryTypographyProps={{ fontSize: '11px', fontWeight: 600, color: 'text.secondary', letterSpacing: '0.5px' }}
                                        />
                                    </ListItem>
                                    {suggestions.map((suggestion, index) => (
                                        <ListItemButton
                                            key={index}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            sx={{ py: 1.5, px: 2, backgroundColor: '#ffffff' }}
                                        >
                                            <SearchIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 20 }} />
                                            <ListItemText primary={suggestion} primaryTypographyProps={{ fontSize: '15px' }} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Paper>
                        </Popper>
                    </Box>
                </ClickAwayListener>

                <Box className="datepicker-box">
                    <DatePicker
                        value={startDate}
                        onChange={(newValue) => {
                            setStartDate(newValue);
                            if (endDate && newValue && newValue > endDate) setEndDate(null);
                        }}
                        format="dd/MM/yyyy"
                        disablePast
                        open={openStart}
                        onOpen={() => setOpenStart(true)}
                        onClose={() => setOpenStart(false)}
                        slotProps={{
                            field: {
                                clearable: true,
                                onClear: () => setStartDate(null)
                            },
                            textField: {
                                variant: 'standard',
                                label: 'Fecha inicio',
                                placeholder: 'Fecha inicio',
                                className: 'datepicker-item',
                                onClick: () => setOpenStart(true),
                                InputLabelProps: { shrink: true },
                                InputProps: {
                                    disableUnderline: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }
                            }
                        }}
                    />

                    <Box sx={{ color: '#ccc', mx: 0.5 }}>|</Box>

                    <DatePicker
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        format="dd/MM/yyyy"
                        disablePast
                        minDate={startDate || undefined}
                        open={openEnd}
                        onOpen={() => setOpenEnd(true)}
                        onClose={() => setOpenEnd(false)}
                        slotProps={{
                            field: {
                                clearable: true,
                                onClear: () => setEndDate(null)
                            },
                            textField: {
                                variant: 'standard',
                                label: 'Fecha fin',
                                placeholder: 'Fecha fin',
                                className: 'datepicker-item',
                                onClick: () => setOpenEnd(true),
                                InputLabelProps: { shrink: true },
                                InputProps: {
                                    disableUnderline: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }
                            }
                        }}
                    />
                </Box>

                <Button
                    variant="contained"
                    onClick={handleSearch}
                    className="search-button-mobile"
                    startIcon={<SearchIcon />}
                    sx={{
                        backgroundColor: '#ff2828',
                        color: 'white',
                        borderRadius: '30px',
                        padding: '10px 28px',
                        textTransform: 'none',
                        fontSize: '15px',
                        fontWeight: 700,
                        boxShadow: 'none',
                        '&:hover': { backgroundColor: '#e02020' }
                    }}
                >
                    Buscar
                </Button>
            </Box>
        </LocalizationProvider>
    );
}