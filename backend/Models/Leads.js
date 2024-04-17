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
        interestedProjects: {
            type: String,
            default: ''
        },
        bugdet: {
            type: String,
            default: ''
        },
        address: {
            type: String,
            default: ''
        },
        meetingDate: {
            type: Date,
            default: null
        },
        meetingTime: {
            type: String,
            default: ""
        },
        leadScore: {
            type: Number,
            default: 0
        },
        stage: {
            type: String,
            default: 'new'
        },
        generalManagerID: {
            type: mongoose.Types.ObjectId,
            ref: 'Registration',
        },
        generalManagerName: {
            type: String,
            default: ""
        },
        managerID: {
            type: mongoose.Types.ObjectId,
            ref: 'Registration',
        },
        managerName: {
            type: String,
            default: ""
        },
        employeeID: {
            type: mongoose.Types.ObjectId,
            ref: 'Registration',
        },
        employeeName: {
            type: String,
            default: ""
        },
        leadStatus: [
            {
                message: String,
                date: Date
            }
        ],
        notes: [
            {
                message: String,
                date: Date
            }
        ],
        documents: [
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
