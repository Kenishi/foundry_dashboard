import { Button, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import { useQuery } from "react-query";

export const Control = () => {
    const [ status, setStatus ] = useState("unknown");

    async function fetchStatus() { 
        const result = await fetch("http://foundry-dashboard-api:45321/status");
        console.log(result);
    }

    return (
        <div>
            <Grid container>
                <Grid xs={12}>Foundry Server</Grid>
                <Grid xs={6}>Status</Grid>
                <Grid xs={6}>${status}</Grid>
                <Grid xs={12}>
                    <Box>
                        <Grid xs={6}>
                            <Button>Restart</Button>
                        </Grid>
                        <Grid xs={6}>
                            <Button>Update Server</Button>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </div>
    )
};