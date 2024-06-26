import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Avatar, Box, Button, Chip, Tooltip, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { auth } from '../../config/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import ApprovalModal from '../Other/ApprovalModal';
import Navbar2 from '../Other/Navbar2';

const pending = (
    <Chip
        sx={{ bgcolor: 'red', color: 'white', p: 1, width: 120 }}
        avatar={<Avatar sx={{ bgcolor: '#ED5E5E' }}>P</Avatar>}
        label="Pending"
    />
);

const approved = (
    <Chip
        sx={{ bgcolor: 'green', color: 'white', p: 1, width: 120 }}
        avatar={<Avatar sx={{ bgcolor: '#6AD975' }}>A</Avatar>}
        label="Approved"
    />
);

const getStatusChip = (approvalStatus) => {
    return approvalStatus === 'Yes' ? approved : pending;
};

function BasicTable({ rows, handleModalOpen }) {
    return (
        <TableContainer component={Paper}>
            <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Restaurant Name</TableCell>
                        <TableCell align="center">Permit</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row" align="center">
                                {row.restaurantName}
                            </TableCell>
                            <TableCell align="center">{row.restaurantPermit}</TableCell>
                            <TableCell align="center">{getStatusChip(row.approved)}</TableCell>
                            <TableCell align="center">
                                <Tooltip title="View Restaurant">
                                    <Button variant="text" onClick={() => handleModalOpen(row)}>
                                        <LoginIcon />
                                    </Button>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

const SuperAdmin = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const navigate = useNavigate(); // Initialize the useNavigate hook

    const fetchRestaurants = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'admin_users'));
            const restaurantsData = querySnapshot.docs.map(doc => ({
                restaurantId: doc.id,
                restaurantName: doc.data().restaurantName,
                restaurantEmail: doc.data().restaurantEmail,
                restaurantPermit: doc.data().restaurantPermit,
                contactNum: doc.data().contactNum,
                restaurantStreetAddress: doc.data().restaurantStreetAddress,
                restaurantBarangay: doc.data().restaurantBarangay,
                restaurantCity: doc.data().restaurantCity,
                restaurantZipCode: doc.data().restaurantZipCode,
                restaurantContactNumber: doc.data().restaurantContactNumber,
                province: doc.data().province,
                country: doc.data().country,
                approved: doc.data().approved,
                restaurantLogo: doc.data().restaurantLogo,
            }));
            setRestaurants(restaurantsData);
        } catch (error) {
            console.error("Error fetching restaurant data: ", error);
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const handleModalOpen = (restaurant) => {
        setSelectedRestaurant(restaurant);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        fetchRestaurants(); // Fetch the updated data when the modal closes
    };

    const updateRestaurantApproval = async (updatedRestaurant) => {
        try {
            // Update the restaurant approval status in Firestore
            const restaurantDocRef = doc(db, 'admin_users', updatedRestaurant.restaurantId);
            await updateDoc(restaurantDocRef, {
                approved: updatedRestaurant.approved
            });
            // Update the local state with the updated restaurant
            const updatedRestaurants = restaurants.map(restaurant => {
                if (restaurant.restaurantId === updatedRestaurant.restaurantId) {
                    return updatedRestaurant;
                } else {
                    return restaurant;
                }
            });
            setRestaurants(updatedRestaurants);
        } catch (error) {
            console.error("Error updating restaurant approval status: ", error);
        }
    };

    const handleLogout = () => {
        auth.signOut().then(() => {
            // Logout successful
            console.log("User logged out successfully");
            // Navigate to the login page
            navigate('/login');
        }).catch((error) => {
            // An error occurred
            console.error("Error logging out:", error);
        });
    };

    return (
        <>
            <Navbar2 title={"Super Admin"} />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                    sx={{
                        width: '60vw',
                        height: '100vh',
                        maxHeight: '500px',
                        display: 'flex',
                        border: '2px solid black',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        p: 2
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%', mb: 2 }}>
                        <Typography>Restaurant Approval</Typography>
                    </Box>
                    <ApprovalModal
                        isOpen={modalOpen}
                        onClose={handleModalClose}
                        restaurant={selectedRestaurant}
                        updateRestaurantApproval={updateRestaurantApproval} // Pass the function here
                    />
                    <BasicTable rows={restaurants} handleModalOpen={handleModalOpen} />
                    <Box sx={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                    }}>
                        <Button variant="outlined" onClick={handleLogout}>Logout</Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default SuperAdmin;
