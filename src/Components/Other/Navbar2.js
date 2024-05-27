import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function Navbar2({ title }) {
    return (
        <Box sx={{ flexGrow: 1, mb: 5, }}>
            <AppBar sx={{ bgcolor: '#6AD975' }} position="static">
                <Toolbar variant="dense">
                    <Typography variant="h2" color="inherit" component="div">
                        {title}
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
