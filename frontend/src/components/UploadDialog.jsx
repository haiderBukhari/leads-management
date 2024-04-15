import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios"
import { failedToast, successToast } from '../utils/ToastsNotifications';

export default function UploadLeadsDialog({ fetchData, setFetchData, open, setOpen }) {
    const [file, setFile] = React.useState(null);

    const handleClose = () => {
        setOpen(false);
    };

    const handleFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        setFile(uploadedFile);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        handleClose();

        const formData = new FormData();
        formData.append('file', file);
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/leads`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(() => {
                successToast('Leads Uploaded!')
                setTimeout(() => {
                    setFetchData(!fetchData);
                }, 1000);
            })
        } catch (error) {
            failedToast(error?.response?.data?.message)
        }
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle style={{ color: "#000" }} id="alert-dialog-title">
                    {"Upload Excel File?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Upload the excel file and the Leads data should be uploaded.
                    </DialogContentText>
                </DialogContent>
                <div className="flex flex-col md:flex-row items-center justify-center w-full mt-3">
                    <label style={{ border: "1px solid #000" }} htmlFor="upload" className="bg-[#fff] px-4 py-2 rounded-md cursor-pointer shadow-lg text-black">
                        <span role="img" aria-label="Upload" className="mr-2">
                            📤
                        </span>
                        Upload Excel File
                    </label>
                    <input type="file" id="upload" onChange={handleFileChange} className="hidden" accept=".xls, .xlsx" />
                    {file && <p className="ml-2">{file.name}</p>}
                </div>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={handleSubmit} autoFocus>
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}