import express from 'express'
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer'
import { getAllEmployees, loginUser, RegisterUser } from '../Controller/RegisterationController.js';

const RegisterationRoutes = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        console.log(file)
        const fileName = uuidv4() + '-' + file.originalname; // Generate a unique filename
        cb(null, fileName);
    },
});


const upload = multer({ storage });

RegisterationRoutes.route('/').post(upload.single('file'), RegisterUser).get(loginUser);
RegisterationRoutes.route('/employee').get(getAllEmployees);
export default RegisterationRoutes