import Registration from "../Models/RegisterationModel.js";
import jwt from 'jsonwebtoken'
import { SendEmail } from "../utils/SendEmail.js";

export const RegisterUser = async (req, res) => {
    try {
        const tempData = await Registration.findOne({ email: req.body.email });
        if (tempData) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const password = Math.random().toString(36).slice(-8);
        let userId = 'STS' + Math.floor(Math.random() * 10000 + 1000)
        while (await Registration.findOne({ userId: userId })) {
            userId = 'STS' + Math.floor(Math.random() * 10000 + 1000)
        }
        const registration = new Registration({
            userId: userId,
            password: password,
            name: req.body.name,
            email: req.body.email,
            contactNumber: req.body.contactNumber,
            qualification: req.body.qualification,
            address: req.body.address,
            file: req.file.filename,
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
            throw new Error("User not found");
        }
        if (password !== user.password) {
            throw new Error('Invalid password');
        }
        if (!user.isRoleAssigned) {
            throw new Error('Your role is pending to be verified from the admin');
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
        res.status(200).json({ message: 'Login successful', id: user._id, token: token, name: user.name, STSID: user.userId, isAdmin: user.isAdmin, isManager: user.isManager, isGeneralManager: user.isGeneralManager, isEmployee: user.isEmployee });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ message: error.message });
    }
};


export async function getAllEmployees(req, res) {
    try {
        let query = { isAdmin: false };
        if (!req.validationData.isAdmin) {
            query.$or = [{ generalManagerID: req.validationData._id }, { managerID: req.validationData._id }, { employeeID: req.validationData._id }];
        }
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
        switch (req.query.role) {
            case 'unassigned':
                query.isRoleAssigned = false;
                break;
            case 'assigned':
                query.isRoleAssigned = true;
                break;
            default:
                break;
        }
        // if(req.quer.find){

        // }

        const employees = await Registration.find(query);
        return res.status(200).json(employees);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function assignRoleToUsers(req, res) {
    try {
        const role = req.query.role;
        const users = req.body.users;

        for (const user of users) {
            // Find the user by ID and update their role
            switch (role) {
                case 'generalManager':
                    await Registration.findByIdAndUpdate(user, { isGeneralManager: true, isManager: false, isEmployee: false, isAdmin: false, isRoleAssigned: true });
                    break;
                case 'manager':
                    await Registration.findByIdAndUpdate(user, { isGeneralManager: false, isManager: true, isAdmin: false, isEmployee: false, isRoleAssigned: true });
                    break;
                case 'employee':
                    await Registration.findByIdAndUpdate(user, { isGeneralManager: false, isManager: false, isAdmin: false, isEmployee: true, isRoleAssigned: true });
                    break;
                default:
                    break;
            }
        }

        return res.status(200).json({ message: 'Role assigned successfully' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function assignManagerToUser(req, res) {
    try {
        const users = req.body.users;

        for (const user of users) {
            await Registration.findByIdAndUpdate(user, { managerID: req.query.managerID, managerName: req.query.managerName });
        }

        return res.status(200).json({ message: 'Manager Assigned' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function assignGeneralManagerToUser(req, res) {
    try {
        const users = req.body.users;

        for (const user of users) {
            await Registration.findByIdAndUpdate(user, { generalManagerID: req.query.managerID, generalManagerName: req.query.managerName });
        }

        return res.status(200).json({ message: 'Manager Assigned' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}