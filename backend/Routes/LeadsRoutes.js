import express from 'express'
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer'
import { uploadLeads, getLeads, getLeadsByEmployeeID } from '../Controller/LeadsController.js';
import { assignLead, getLeadsLimit } from '../Controller/assignLeads.js';


const LeadsRoutes = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'leads/');
    },
    filename: (req, file, cb) => {
        console.log(file)
        const fileName = uuidv4() + '-' + file.originalname; // Generate a unique filename
        cb(null, fileName);
    },
});


const upload = multer({ storage });

LeadsRoutes.route('/').get(getLeads).post(upload.single('file'), uploadLeads);
LeadsRoutes.route('/limit').get(getLeadsLimit);
LeadsRoutes.route('/:employeeID').get(getLeadsByEmployeeID);
LeadsRoutes.route('/assign').post(assignLead);
export default LeadsRoutes