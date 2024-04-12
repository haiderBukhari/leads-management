import mongoose from 'mongoose';

const LeadsStatusSchema = new mongoose.Schema(
    {
        EmployeeID: {
            type: mongoose.Types.ObjectId,
        },
        leadID: {
            type: mongoose.Types.ObjectId,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            default: ''
        },
        source: {
            type: String,
            default: ''
        },
        phone: {
            type: Number,
            default: ''
        },
    },
    {
        timestamps: true,
    }
);

const LeadsStatus = mongoose.model('LeadStatus', LeadsStatusSchema);
export default LeadsStatus;