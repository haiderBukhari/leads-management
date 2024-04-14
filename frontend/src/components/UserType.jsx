import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

export default function RoleSelectionDialog({ open, setOpen, AssignRole }) {
    const handleClose = () => {
        setOpen(false);
    };
    const SelectUser = (type) => {
        setOpen(false);
        AssignRole(type);
    }
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="sm" // Setting max width to 500px
            fullWidth // Allowing the dialog to take the full width of its container
        >
            <DialogTitle style={{ color: "#000" }} id="alert-dialog-title">
                {"Choose Assignee?"}
                <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8, color: 'inherit' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Select the role from the following.
                </DialogContentText>
                <div className="container mx-auto p-6">
                    <div className="flex items-center justify-between role cursor-pointer" onClick={() => { SelectUser("generalManager") }}>
                        <div className="flex items-center">
                            <div className="text-lg font-semibold">General Manager</div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                    <div className="flex items-center justify-between role cursor-pointer mt-5 " onClick={() => { SelectUser("manager") }}>
                        <div className="flex items-center">
                            <div className="text-lg font-semibold">Manager</div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                    <div className="flex items-center justify-between role cursor-pointer mt-5" onClick={() => { SelectUser("employee") }}>
                        <div className="flex items-center">
                            <div className="text-lg font-semibold">Employee</div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </DialogContent>
            <div className="flex items-center justify-center w-full mt-3">
            </div>
        </Dialog>
    );
}