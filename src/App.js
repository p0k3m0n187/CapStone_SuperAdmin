import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './Components/Page/LoginPage';
import SuperAdmin from './Components/Page/SuperAdmin';
import { Box } from '@mui/material';

const App = () => {

  return (
    <>
      <Box sx={{ margin: -1 }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="superadmin" element={<SuperAdmin />} />
          </Routes>
        </BrowserRouter>
      </Box>
    </>
  );
}

export default App;