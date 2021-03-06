import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Typography } from "@mui/material";
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
        fetch(`${FOUNDRY_API_URL}/update?version=${selectedVersion}`)
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
    let [currentVersion, setCurrentVersion] = useState("unknown");
    let [availableZipInstalls, setAvailableZipInstalls] = useState<string[]>([]);
    let [selectedVersion, setSelectedVersion] = useState<string>("");

    const handleVersionChange = (event: SelectChangeEvent) => {
        setSelectedVersion(event.target.value as string);
    }

    useEffect(() => {
        setSelectedVersion(currentVersion);
    }, [currentVersion]);

    const result = useQuery("status", fetchStatus);
    useEffect(() => {
        if(result.isSuccess && result.data) {
            const data: Result<any> = result.data;
            
            if(data.statusCode === 200) {
                setStatus(data.data.state);
                setUptime(moment.duration(moment().diff(data.data.started)).humanize());
                setCurrentVersion(data.data.currentVersion);
                setAvailableZipInstalls(data.data.availableZipInstalls);
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
                        <Box component={Grid} item container xl={5}>
                            <Grid container item xl={12}>
                                <Grid item xl={3.5}>Status:</Grid>
                                <Grid item xl={8.5}>{status}</Grid>
                            </Grid>
                            <Grid container item xl={12}>
                                <Grid item xl={3.5}>Uptime:</Grid>
                                <Grid item xl={8.5}>{uptime}</Grid>
                            </Grid>
                        </Box>
                        <Box component={Grid} item xl={2} sx={{ visibility: result.isFetching ? 'visible' : 'hidden' }}>
                            <CircularProgress/>
                        </Box>
                        <Box component={Grid} item xl={3}>
                            <Button variant="contained" sx={{m:1}} onClick={handleRestartServer}>Restart</Button>
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
                    <Paper component={Grid} container item xl={12} sx={{p:2, ml:2, mr:2 }} elevation={3}>
                        <Grid container item xl={7}>
                            <Grid container sx={{mb: 2}}>
                                <Grid item xl={7}>
                                    <Typography>Running Version:</Typography>
                                </Grid>
                                <Grid item xl={3}>
                                    <b>{currentVersion}</b>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xl={7}  sx={{verticalAlign:"middle"}}>
                                    <Typography id="updateVersionLabel">Update/Install Version:</Typography>
                                </Grid>
                                <Grid item xl={3}>
                                    <FormControl>
                                    <InputLabel id="updateVersionLabel">Version</InputLabel>
                                    <Select
                                        labelId="updateVersionLabel"
                                        size="small"
                                        value={selectedVersion}
                                        label="Version"
                                        onChange={handleVersionChange}
                                    >
                                        {availableZipInstalls.map((ver) => {
                                            return (
                                                <MenuItem key={ver} value={ver}>{ver}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xl={5}>
                            <Button variant="contained" sx={{m:1}} onClick={handleShowUpdateAlert}>Update Server</Button>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <Paper component={Grid} container item xl={12} sx={{ mx:2, my:1, p:2 }} elevation={3}>
                <Typography variant="h5" sx={{textAlign:"center"}}>Update Notes</Typography>
                <ul>
                    <li>
                        Select the version in the list to update or install (you can downgrade this way if need be), and hit "Update" 
                    </li>
                    <li>
                        The server zip must have this <b>case-sensitive</b> filename format: <u>foundryvtt-#.###.zip</u>
                    </li>
                    <li>
                        If the new version STILL isn't showing up after confirming the file format matches, it may because 
                        the <a href="https://github.com/felddy/foundryvtt-docker">docker image</a> hasn't been updated for the new foundry version yet.
                    </li>
                </ul>
            </Paper>
            <UpdateAlert version={selectedVersion} updateFunction={handleUpdateServer} open={open} setOpen={setOpen}/>
        </Paper>
    )
};