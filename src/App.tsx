import React, { useEffect, useState } from 'react';
import './App.css';
import { Control } from './components/control';
import { Logs } from './components/logs';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { CssBaseline } from '@mui/material';
import { io, Socket } from "socket.io-client";
import { FOUNDRY_API_SOCKET_URL_PATH } from "./constants";


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
        {value === index && (
            <Box sx={{ p: 3 }}>
            {children}
            </Box>
        )}
        </div>
    );
}

function App() {
  const [ value, setValue ] = useState(0);
  
    // Logs vars
    const [socket, setSocket] = useState<Socket>(io('/', { path: FOUNDRY_API_SOCKET_URL_PATH, autoConnect: false }));
    const [logs, setLogs] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [status, setStatus] = useState("Disconnected");
    const [limit, setLimit] = useState("2000");
    
    useEffect(() => {
        const newSocket = io("/", { path: FOUNDRY_API_SOCKET_URL_PATH, autoConnect: false });
        setSocket(newSocket);
    }, [setSocket]);

    useEffect(() => {
        socket.io.removeAllListeners();
        socket.removeAllListeners();
        
        socket.io.on("reconnect_attempt", (attempt: number) => {
            setStatus(`Reconnecting...(${attempt})`)
        });
        socket.io.on("reconnect_failed", () => {
            setStatus("Disconnected (reconnect failed)");
            setIsRunning(false);
        });
        socket.on("connect", () => {
            setLogs([]);
            socket?.emit("refresh", { "limit": limit });
            setIsRunning(true);
            setStatus("Connected");
        });
        socket.on("disconnect", () => {
            console.log("Disconnected from server");
            setStatus("Disconnected");
            setIsRunning(false);
        });
        
        socket.on("refresh", (data: string) => {
            setLogs((currentState: any[]) => [data, ...currentState]);
        });
        socket.on("data", (data: string) => {
            // setLogs([...logs, data]);
            setLogs((currentState: any[]) => [...currentState, data]);
        });

        return () => { socket.disconnect() }
    }, [socket, limit])

    const logProps = {
        socket: socket,
        logs: logs,
        setLogs: setLogs,
        isRunning: isRunning,
        setIsRunning: setIsRunning,
        status: status,
        setStatus: setStatus,
        limit: limit,
        setLimit: setLimit
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <React.Fragment>
            <CssBaseline/>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Control Panel" />
                    <Tab label="Logs" />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Control/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Logs {...logProps} />
            </TabPanel>
        </React.Fragment>
    );
}

export default App;
