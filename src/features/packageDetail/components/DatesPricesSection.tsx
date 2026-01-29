import { Box, TextField, MenuItem, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useState } from "react";
import type { DatePriceItem } from "../../../shared/models/package.ts";

export default function DatesPricesSection({ dates }: { dates: DatePriceItem[] }) {
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState("date");

    const filtered = dates
        .filter(d => d.startDate.includes(query))
        .sort((a, b) => {
            if (sort === "low") return a.price - b.price;
            if (sort === "high") return b.price - a.price;
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        });

    return (
        <Box className="tab-content">
            <Box className="search-sort">
                <TextField label="Buscar fecha" value={query} onChange={e => setQuery(e.target.value)} />
                <TextField select label="Ordenar por" value={sort} onChange={e => setSort(e.target.value)}>
                    <MenuItem value="date">Fecha más reciente</MenuItem>
                    <MenuItem value="low">Precio (Bajo a Alto)</MenuItem>
                    <MenuItem value="high">Precio (Alto a Bajo)</MenuItem>
                </TextField>
            </Box>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Inicio</TableCell>
                        <TableCell>Fin</TableCell>
                        <TableCell>Cupos</TableCell>
                        <TableCell>Precio</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filtered.map((d, i) => (
                        <TableRow key={i}>
                            <TableCell>{d.startDate}</TableCell>
                            <TableCell>{d.endDate}</TableCell>
                            <TableCell>{d.spaceLeft}</TableCell>
                            <TableCell>${d.price}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
}
