import { Button, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import moment from "moment";
import { FOUNDRY_API_URL } from "../constants";
import { UpdateAlert } from "./updateAlert";

 interface Result<T> {
    statusCode: number,
    message: string,
    data: T
}

export const Control = () => {
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);

    const queryClient = useQueryClient();

    async function fetchStatus() { 
        const result = await fetch(`${FOUNDRY_API_URL}/status`);
        return result.json();
    }

    const handleRestartServer = () => {
        setStatus("restarting...");
        fetch(`${FOUNDRY_API_URL}/restart`)
            .then((result) => result.json())
            .then((result) => {
                queryClient.invalidateQueries('status');
                if(result.statusCode !== 204) {
                    setError(`${result.statusCode} : ${result.message}`);
                }
            });
    }

    const handleHideError = () => setError("");

    const handleUpdateServer = () => {
        setStatus("updating...");
        fetch(`${FOUNDRY_API_URL}/update`)
            .then((result) => result.json())
            .then((result) => {
                queryClient.invalidateQueries('status');
                if(result.statusCode !== 200) {
                    setError(`${result.statusCode} : ${result.message}`)
                }
            });
    }

    const handleShowUpdateAlert = () => setOpen(true);

    let [status, setStatus] = useState("unknown");
    let [uptime, setUptime] = useState("unknown");

    const result = useQuery("status", fetchStatus);
    useEffect(() => {
        if(result.isSuccess && result.data) {
            const data: Result<any> = result.data;
            
            if(data.statusCode === 200) {
                setStatus(data.data.state);
                setUptime(moment.duration(moment().diff(data.data.started)).humanize());
            }
            else if(data.statusCode === 404) {
                setStatus("Unknown -- Not Found, try Restart");
                setUptime("none");
            }
            else {
                setStatus("Error");
                setError(`Error: ${data.statusCode} - ${data.message}`);
            }
        }
        else if(result.isFetching) {
            setStatus("refreshing...");
        }
    }, [result]);
    

    return (
        <Paper component={Grid} container style={{width:"600px"}}>
            <Grid container spacing={1}>
                <Grid item xl={12} sx={{textAlign: "center"}}>Foundry Server</Grid>
                <Grid container item xl={12}>
                    <Paper component={Grid} item container xl={12} sx={{ p: 2, ml: 2, mr:2 }} elevation={3}>
                        <Box component={Grid} item container xl={9}>
                            <Grid container item xl={12}>
                                <Grid item xl={3}>Status:</Grid>
                                <Grid item xl={8}>{status}</Grid>
                            </Grid>
                            <Grid container item xl={12}>
                                <Grid item xl={3}>Uptime:</Grid>
                                <Grid item xl={5}>{uptime}</Grid>
                            </Grid>
                        </Box>
                        <Box component={Grid} item xl={3}>
                            <CircularProgress sx={{ visibility: result.isFetching ? 'visible' : 'hidden' }} />
                        </Box>
                    </Paper>
                </Grid>
                <Grid container item xl={12} sx={{ display: error.length > 0 ? "" : "none" }}>
                    <Paper component={Grid} container item xl={12} sx={{p:2, ml:2, mr:2, backgroundColor:"#300"}} elevation={3}>
                        <Grid item xl={8}>
                            <Typography>{error}</Typography>
                        </Grid>
                        <Grid item xl={3}>
                            <Button variant="contained" onClick={handleHideError}>Hide</Button>
                        </Grid>
                    </Paper>
                </Grid>                
                <Grid container item xl={12}>
                    <Paper component={Grid} container item xl={12} sx={{p:2, ml:2, mr:2, mb:2}} elevation={3}>
                        <Grid item xl={6}>
                            <Button variant="contained" sx={{m:1}} onClick={handleRestartServer}>Restart</Button>
                        </Grid>
                        <Grid item xl={6}>
                            <Button variant="contained" sx={{m:1}} onClick={handleShowUpdateAlert}>Update Server</Button>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <Paper component={Grid} container item xl={12} sx={{ m:2, p:2 }} elevation={3}>
                <Typography variant="h5" sx={{textAlign:"center"}}>Update Checklist</Typography>

                
            </Paper>
            <UpdateAlert updateFunction={handleUpdateServer} open={open} setOpen={setOpen}/>
        </Paper>
    )
};