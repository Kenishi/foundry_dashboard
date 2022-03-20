import { Box, Button, Grid, Paper, TextField } from "@mui/material";
import { Socket } from "socket.io-client";

export type ILogsProps = {
    socket: Socket,
    logs: string[],
    setLogs: React.Dispatch<React.SetStateAction<string[]>>
    isRunning: boolean,
    setIsRunning: React.Dispatch<React.SetStateAction<boolean>>
    status: string,
    setStatus: React.Dispatch<React.SetStateAction<string>>,
    limit: string,
    setLimit: React.Dispatch<React.SetStateAction<string>>
}

export const Logs = (props: ILogsProps) => {
    const socket = props.socket;

    const [logs,] = [props.logs, props.setLogs];
    const [isRunning, setIsRunning] = [props.isRunning, props.setIsRunning];
    const [status, setStatus] = [props.status, props.setStatus];
    const [limit, setLimit] = [props.limit, props.setLimit];

    const handleStartLogs = () => {
        setIsRunning(true);
        socket.connect();        
    }

    const handleStopLogs = () => {
        setIsRunning(false);
        setStatus("Disconnected");
        socket.disconnect();
    }

    const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(event.target.value);
        console.log(event.target.value);
    }

    return (
        <Box>
            <Paper component={Grid} container>
                <Box component={Grid} container item xl={12} sx={{ m:2 }}>
                    <Grid item xl={0.5}>
                        Status:
                    </Grid>
                    <Grid item xl={4}>
                        {status}
                    </Grid>
                </Box>
                <Box component={Grid} container item xl={12} sx={{ m:2 }}>
                    <Grid item xl={2}>
                        Limit to last # logs (-1 = all logs):
                    </Grid>
                    <Grid item xl={.55}>
                        <TextField size="small" inputProps={{ inputMode: 'numeric', pattern: "[0-9]*"}} variant="outlined" value={limit} onChange={handleLimitChange}/>
                    </Grid>
                </Box>
                <Paper component={Grid} item container xl={2.5} sx= {{ m:2, p:2 }} elevation={3}>
                    <Box component={Grid} item container xl={12} spacing={2}  sx={{ p:0, textAlign: "center" }}>
                        <Grid item xl={6}>
                            <Button onClick={handleStartLogs} disabled={isRunning} variant="contained">Connect</Button>
                        </Grid>
                        <Grid item xl={6}>
                            <Button onClick={handleStopLogs} disabled={!isRunning} variant="contained">Disconnect</Button>
                        </Grid>
                    </Box>
                </Paper>
            </Paper>
            <Grid item container xl={12} sx={{ height: "100%" }}>
                <Paper component="pre" sx={{ height: "100%", p:2, width: "100%" }}>
                    {logs.length > 0 ? logs : "No logs data"}
                </Paper>
            </Grid>
        </Box>
    );
}