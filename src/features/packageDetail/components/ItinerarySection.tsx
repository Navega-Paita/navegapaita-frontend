import { Box, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import { useState } from "react";
import type { ItineraryItem } from "../../../shared/models/package.ts";

export default function ItinerarySection({ itinerary }: { itinerary: ItineraryItem[] }) {
    const [showAll, setShowAll] = useState(false);
    const visible = showAll ? itinerary : itinerary.slice(0, 2);

    return (
        <Box className="tab-content">
            <List>
                {visible.map((item, i) => (
                    <ListItem key={i} alignItems="flex-start">
                        <ListItemText
                            primary={item.title}
                            secondary={item.description}
                        />
                    </ListItem>
                ))}
            </List>

            <Button onClick={() => setShowAll(!showAll)}>
                {showAll ? "Ocultar itinerario" : "Mostrar todo el itinerario"}
            </Button>
        </Box>
    );
}
