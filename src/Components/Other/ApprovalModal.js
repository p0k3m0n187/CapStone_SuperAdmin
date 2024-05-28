import React from 'react';
import { Box, Button, Modal, TextField } from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'white',
    border: '2px solid #000',
    borderRadius: '10px',
    boxShadow: 24,
    p: 2,
    overflowY: 'auto',
    maxHeight: '90vh',
};

const ApprovalModal = ({ isOpen, onClose, restaurant, updateRestaurantApproval }) => {

    const handleApprove = async () => {
        if (restaurant) {
            try {
                // Reference to the Firestore document
                const restaurantDocRef = doc(db, 'admin_users', restaurant.restaurantId);

                // Update the Firestore document
                await updateDoc(restaurantDocRef, {
                    approved: 'Yes'
                });

                // Update the local state in the parent component
                updateRestaurantApproval({ ...restaurant, approved: 'Yes' });

                // Close the modal after approval
                onClose();
            } catch (error) {
                console.error("Error updating approval status: ", error);
            }
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
        >
            <Box sx={style}>
                <Box sx={{ display: 'flex' }}>
                    <Box sx={{ width: '40%', p: 1 }}>
                        <Box>
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '450px',
                                    borderRadius: '5px',
                                    border: '1px solid black',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                {restaurant && restaurant.restaurantLogo && (
                                    <img
                                        src={restaurant.restaurantLogo}
                                        alt="Restaurant Logo"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ width: '60%', height: '50%' }}>
                        <Box sx={{ overflowY: 'auto', height: '470px', p: 1, mb: 2 }}>
                            {restaurant && (
                                <>
                                    <Box sx={{ mb: 5 }}>
                                        <TextField
                                            fullWidth
                                            variant="standard"
                                            label="Restaurant Name"
                                            name="restaurant_name"
                                            value={restaurant.restaurantName}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ mb: 5 }}>
                                        <TextField
                                            fullWidth
                                            variant="standard"
                                            label="Restaurant Email"
                                            name="restaurant_email"
                                            value={restaurant.restaurantEmail}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ mb: 5 }}>
                                        <TextField
                                            fullWidth
                                            variant="standard"
                                            label="Restaurant Permit Number"
                                            name="restaurant_permit"
                                            value={restaurant.restaurantPermit}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ mb: 5 }}>
                                        <TextField
                                            fullWidth
                                            variant="standard"
                                            label="Restaurant Contact Number"
                                            name="restaurant_number"
                                            value={restaurant.contactNum}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ mb: 5 }}>
                                        <TextField
                                            fullWidth
                                            variant="standard"
                                            label="Approve"
                                            name="restaurant_approve"
                                            value={restaurant.approved}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ mb: 5 }}>
                                        <TextField
                                            fullWidth
                                            variant="standard"
                                            label="Restaurant Address"
                                            name="restaurant_address"
                                            value={`${restaurant.restaurantStreetAddress}, ${restaurant.restaurantBarangay}, ${restaurant.restaurantCity}, ${restaurant.province}, ${restaurant.country}`}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Box>
                                </>
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                sx={{
                                    mr: 2,
                                    width: 100,
                                    border: '1px solid #03A140',
                                    '&:hover': {
                                        bgcolor: 'white',
                                    },
                                }}
                                onClick={handleApprove}
                            >
                                Approve
                            </Button>
                            <Button
                                sx={{
                                    width: 100,
                                    border: '1px solid red',
                                    '&:hover': {
                                        color: 'red',
                                        bgcolor: 'white',
                                        border: '1px solid red',
                                    },
                                }}
                                variant="contained"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default ApprovalModal;
