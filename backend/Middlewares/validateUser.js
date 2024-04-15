import jwt from 'jsonwebtoken';
import Registration from './../Models/RegisterationModel.js';

export const validateUser = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            next();
        }
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET_KEY); // Replace 'your_secret_key_here' with your actual secret key
        const userId = decoded.id;
        const user = await Registration.findById(userId);

        req.validationData = user;

        next();
        //if (user) {
        //    return user;
        //} else {
        //    throw new Error('User not found');
        //}
    } catch (error) {
        console.error('Error validating user:', error);
        return null; // or throw new Error('Error validating user');
    }
};
