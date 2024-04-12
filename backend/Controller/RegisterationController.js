import Registration from "../Models/RegisterationModel.js";
import jwt from 'jsonwebtoken'
import { SendEmail } from "../utils/SendEmail.js";

export const RegisterUser = async (req, res) => {
    try {
        const tempData = await Registration.findOne({email: req.body.email});
        if(tempData){
            return res.status(400).json({ message: 'User already exists' });
        }
        const password = Math.random().toString(36).slice(-8);
        let userId = 'STS' + Math.floor(Math.random() * 10000 + 1000)
        while(await Registration.findOne({userId: userId})){
            userId = 'STS' + Math.floor(Math.random() * 10000 + 1000)
        }
        const name1 = req.body.name.toLowerCase();
        const registration = await new Registration({
            userId: userId,
            password: password,
            name: req.body.name,
            email: req.body.email,
            contactNumber: req.body.contactNumber,
            qualification: req.body.qualification,
            address: req.body.address,
            file: req.file.filename,
            isAdmin: name1.includes('admin'),
            isEmployee: !name1.includes('admin')
        });
        await registration.save();
        SendEmail(req.body.email, req.body.name, userId, password);
        return res.status(200).json({ message: 'Registration Successful' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { STSID, password } = req.query;
        const user = await Registration.findOne({ userId: STSID });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
        res.status(200).json({ message: 'Login successful', id: user._id, token: token, name: user.name, STSID: user.userId });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export async function getAllEmployees(req, res) {
    try {
        let query = { isAdmin: false };

        switch (req.query.type) {
            case 'generalManager':
                query.isGeneralManager = true;
                break;
            case 'manager':
                query.isManager = true;
                break;
            case 'employee':
                query.isEmployee = true;
                break;
            default:
                break;
        }

        const employees = await Registration.find(query);
        return res.status(200).json(employees);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
