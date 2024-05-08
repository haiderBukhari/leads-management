import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Checkbox from '@mui/material/Checkbox';
import axios from "axios"
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux"
import { registerUser } from '../../store/features/AuthenticationSlice';
import { failedToast, successToast } from '../../utils/ToastsNotifications';

export default function Login() {
    const dispatch = useDispatch();
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const [stsID, setSTSID] = useState("");
    const [password, setPassword] = useState("");
    // const [rememberMe, setRememberMe] = useState(true)
    const [showPassword, setShowPassword] = React.useState(false);
    const Navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/register?STSID=${stsID}&password=${password}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (typeof window !== "undefined") {
                localStorage.setItem("userData", JSON.stringify({
                    userID: response.data.id
                }));
            }
            const email = response.data.name.toLowerCase();
            dispatch(registerUser({
                userId: response.data.id,
                stsID: response.data.STSID,
                name: response.data.name,
                jwtToken: response.data.token,
                isAdmin: response.data.isAdmin,
                isGeneralManager: response.data.isGeneralManager,
                isManager: response.data.isManager,
                isEmployee: response.data.isEmployee,
            }))
            if (email.includes('admin')) {
                Navigate('/LeadManagement');
            } else {
                Navigate('/LeadManagement');
            }
            successToast('Login successfully!')
        } catch (error) {
            failedToast(error?.response?.data?.message)
        }
    };

    return (
        <div>
            <div className='flex justify-center items-center pr-3 md:px-7 md:pt-10 bg-white'>
                <div className='bg-gray-100 w-[50%] py-10 hidden md:flex md:justify-center rounded-2xl'>
                    <img className='w-[63%] h-[auto] rounded-3xl' src='/assets/login.png' alt="login" />
                </div>
                <div className='flex-1 text-gray-700 w-[40%] ml-3 md:ml-10'>
                    <img className='w-[60%] h-[auto] rounded-3xl mb-10 pt-5 md:hidden' src='/assets/logo.png' alt="logo" />
                    <h1 className='text-3xl md:text-4xl font-medium'>Welcome to STOREYS! <span className="hidden md:inline">👋🏻</span></h1>
                    <p className='mt-3 mb-4 text-gray-500'>Please sign-in to your account and start the adventure</p>
                    <div>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { width: '100%' },
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField onChange={(e) => { setSTSID(e.target.value) }} id="outlined-basic" label="STS ID" variant="outlined" className="mt-3" value={stsID} />
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            <FormControl sx={{ width: '100%' }} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password" className="mt-6">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    onChange={(e) => { setPassword(e.target.value) }}
                                    value={password}
                                    type={showPassword ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                    className="mt-6"
                                />
                            </FormControl>
                        </Box>
                    </div>
                    <div className="flex justify-between items-center mt-6 mb-5">
                        <div className="flex items-center">
                            <Checkbox {...label} /> <span className="text-[#902bf5]">Remember Me</span>
                        </div>
                        <p className="text-[#902bf5]">Forget Password?</p>
                    </div>
                    <button onClick={handleSubmit} className="bg-[#902bf5] w-[100%] text-xl shadow-lg rounded-md hover:opacity-85 active:opacity-55 text-white py-3 mb-6">Sign In</button>
                    <div className="flex justify-center mt-4">
                        <p>New on Our Platform? </p>

                        <Link to="/register">
                            <span className="text-[#902bf5] ml-3">Create an account</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}