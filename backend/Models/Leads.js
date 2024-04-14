import mongoose from 'mongoose';

const LeadsSchema = new mongoose.Schema(
    {
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
        isAssigned: {
            type: Boolean,
            default: false
        },
        leadStatus: [
            {
                message: String,
                date: Date
            }
        ],
        uploadedDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
    }
);

const LeadsModel = mongoose.model('Leads', LeadsSchema);

export default LeadsModel;
