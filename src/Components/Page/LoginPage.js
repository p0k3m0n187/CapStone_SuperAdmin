import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Other/Navbar';
import { Box, Button, TextField } from '@mui/material';
import Logo from '../Images/logo.png';
import { auth, db } from '../../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch user data from Firestore
            const docRef = doc(db, 'super_admin', user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // User is authenticated and has admin access
                const userData = docSnap.data();
                const firstName = userData.first_name; // Assuming the field name is "firstname"

                // Log user's first name to the console
                console.log('Hello!', firstName);

                navigate('/superadmin');
            } else {
                // User does not have admin access
                console.log('You do not have admin access.');
            }
        } catch (error) {
            console.log('Error:', error)
        }
    };

    return (
        <>
            <Navbar title={"WasteNot"} />
            <Box
                component="form"
                onSubmit={handleLogin}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 10 }}>
                <Box sx={{ width: 500, height: 500, border: '2px solid #068112', borderRadius: 2, boxShadow: '0px 10px 5px 5px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <img
                        src={Logo}
                        alt=""
                        style={{
                            width: '250px',
                            height: '250px',
                            marginBottom: '20px'  // Optional: Adds some space below the logo
                        }}
                    />
                    {/* {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )} */}
                    <Box sx={{ width: '80%', mb: 2 }}>
                        <TextField
                            variant="filled"
                            label="Email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ width: '80%', mb: 2 }}>
                        <TextField
                            type='password'
                            variant="filled"
                            label="Password"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Box>
                    <Box>
                        <Button
                            sx={{
                                bgcolor: '#6AD975',
                                '&:hover': {
                                    bgcolor: '#4CAF50'  // Green color on hover
                                }
                            }}
                            variant="contained"
                            type="submit"
                        >
                            Login
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default LoginPage;
