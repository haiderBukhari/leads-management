import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import { Button, DialogActions, IconButton } from '@mui/material';

export default function ProductivityDialog({ open, setOpen, show, setShow }) {
    const handleClose = () => {
        setOpen(false);
    };
    const leadStatus = [
        "Total Leads",
        "Hot",
        "Warm",
        "Cold",
        "New"
    ]

    const callingStatus = [
        "Total Talktime",
        "Total Connected",
        "Average Call Buttons",
        "Top 10 Talktime"
    ]

    const coldCalls = [
        "Total Cold Calls",
        "Total Cold Connected",
        "Unique Cold Calls",
        "Unique Cold Connected"
    ]

    const leadCalls = [
        "Total Lead Call",
        "Total Lead Connected",
        "Unique Lead Connected",
        "Inproper Call",
        "Claim Call Recording"
    ]

    const activitiesDone = [
        "Fresh Meeting",
        "Unique Meeting",
        "Site Visit Done",
        "Meeting Done"
    ]
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
                {"SELECT REQUIRED FIELDS"}
                <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8, color: 'inherit' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className='mt-4 overflow-hidden'>
                <h1 className='text-semibold mb-0 pb-0' id="alert-dialog-description">
                    LEAD STATUS
                </h1>
                <div className="container mx-auto mt-1 ml-3">
                    <div className="grid grid-cols-3"> {/* Adjust grid to contain 3 items per row */}
                        {leadStatus.map((item) => (
                            <div key={item} className="flex items-center">
                                <input className='mr-2' type='checkbox' id={item} value={item} />
                                <label htmlFor={item} className='text-gray-600 text-sm'>{item}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <h1 className='text-semibold mt-1' id="alert-dialog-description">
                    CALLING STATS
                </h1>
                <div className="container mx-auto mt-1 ml-3">
                    <div className="grid grid-cols-3"> {/* Adjust grid to contain 3 items per row */}
                        {callingStatus.map((item) => (
                            <div key={item} className="flex items-center">
                                <input className='mr-2' type='checkbox' id={item} value={item} />
                                <label htmlFor={item} className='text-gray-600 text-sm'>{item}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <h1 className='text-semibold mt-1' id="alert-dialog-description">
                    COLD CALL
                </h1>
                <div className="container mx-auto mt-1 ml-3">
                    <div className="grid grid-cols-3"> {/* Adjust grid to contain 3 items per row */}
                        {coldCalls.map((item) => (
                            <div key={item} className="flex items-center">
                                <input className='mr-2' type='checkbox' id={item} value={item} />
                                <label htmlFor={item} className='text-gray-600 text-sm'>{item}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <h1 className='text-semibold mt-1' id="alert-dialog-description">
                    LEAD CALL
                </h1>
                <div className="container mx-auto mt-1 ml-3">
                    <div className="grid grid-cols-3"> {/* Adjust grid to contain 3 items per row */}
                        {leadCalls.map((item) => (
                            <div key={item} className="flex items-center">
                                <input className='mr-2' type='checkbox' id={item} value={item} />
                                <label htmlFor={item} className='text-gray-600 text-sm'>{item}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <h1 className='text-semibold mt-1' id="alert-dialog-description">
                    ACTIVITIES DONE
                </h1>
                <div className="container mx-auto mt-1 ml-3">
                    <div className="grid grid-cols-3"> {/* Adjust grid to contain 3 items per row */}
                        {activitiesDone.map((item) => (
                            <div key={item} className="flex items-center">
                                <input className='mr-2' type='checkbox' id={item} value={item} />
                                <label htmlFor={item} className='text-gray-600 text-sm'>{item}</label>
                            </div>
                        ))}
                    </div>
                </div>

            </DialogContent>
            <div className="flex items-center justify-center w-full mt-3">
            </div>
            <DialogActions>
                <Button onClick={() => { setOpen(false) }}>Close</Button>
                <Button onClick={() => { setOpen(false); setShow(true) }} autoFocus>
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}