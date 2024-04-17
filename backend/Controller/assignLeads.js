import LeadsModel from "../Models/Leads.js";
import LeadsStatus from './../Models/LeadsStatus.js';
import Registration from "../Models/RegisterationModel.js";

export const assignLead = async (req, res) => {
    const getMessage = (item, employee) => {
        const owner = item.employeeName ? item.employeeName : item.managerName ? item.managerName : item.generalManagerName ? item.generalManagerName : '-';
        if (owner === '-') {
            return `Lead is assigned to ${employee.name}.`
        } else {
            return `Lead owner is changed from ${owner} to ${employee.name}. `
        }
    }
    try {
        const leads = req.body.leads;
        const ownerInfo = await Registration.findOne({ _id: req.body.EmployeeID });
        for (const item of leads) {
            const lead = await LeadsModel.findById(item);
            const message = getMessage(lead, ownerInfo)
            lead.isAssigned = true;
            if (ownerInfo.isGeneralManager) {
                lead.generalManagerID = ownerInfo._id;
                lead.generalManagerName = ownerInfo.name;
                lead.managerID = null,
                    lead.managerName = '',
                    lead.employeeID = null,
                    lead.employeeName = ''
            } else if (ownerInfo.isManager) {
                lead.managerID = ownerInfo._id;
                lead.managerName = ownerInfo.name;
                lead.employeeID = null,
                    lead.employeeName = ''
            } else {
                lead.employeeID = ownerInfo._id;
                lead.employeeName = ownerInfo.name;
            }
            lead.leadStatus.unshift({
                message: message,
                date: new Date()
            });
            await lead.save();
            await LeadsStatus.deleteMany({ leadID: item.id });
            await new LeadsStatus({
                leadID: item.id,
                EmployeeID: req.body.EmployeeID,
                name: lead.name,
                email: lead.email,
                source: lead.source,
                phone: lead.phone,
            }).save();
        }
        res.status(200).json({ message: 'Lead assigned successfully' });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ message: err.message });
    }
};

export const getAssignedLeads = async (req, res) => {
    try {
        const { customerId } = req.params;
        const customer = await CustomersModel.findById(customerId).populate('assignedLeads');
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(customer.assignedLeads);
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ message: err.message });
    }
};

export const getLeadById = async (req, res) => {
    try {
        const { leadId } = req.params;

        const lead = await LeadsModel.findById(leadId);

        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        res.status(200).json(lead);
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ message: err.message });
    }
};

export const getLeadsLimit = async (req, res) => {
    console.log("getting...");
    try {
        const { num } = req.query;
        const limit = parseInt(num) || 5; // Default to fetching top 5 leads if num is not provided or invalid

        const totalLeads = await LeadsModel.find();
        // Fetch the top N leads sorted by the latest date
        const leads = await LeadsModel.find().sort({ createdAt: -1 }).limit(limit);

        res.status(200).json({ leads, totalLeads: totalLeads.length });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ message: err.message });
    }
};


export const addNote = async (req, res) => {
    try {
        const { leadId } = req.query;
        const { message } = req.body;

        const lead = await LeadsModel.findById(leadId);

        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        lead.notes.unshift({
            message,
            date: new Date()
        });

        await lead.save();

        res.status(200).json({ message: 'Note added successfully' });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ message: err.message });
    }
};

export const updateLead = async (req, res) => {
    try {
        const { leadId } = req.params;
        const lead = await LeadsModel.findByIdAndUpdate(leadId, req.body, { new: true });
        return res.status(200).json(lead);
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ message: err.message });
    }
}

export const uploadFile = async (req, res) => {
    try {
        const { leadId } = req.params;
        const lead = await LeadsModel.findById(leadId);
        lead.documents.unshift({
            message: req.file.path,
            date: new Date()
        });
        await lead.save();
        res.status(200).json({ message: 'File uploaded successfully' });

    } catch (err) {
        console.log(err.message);
        res.status(400).json({ message: err.message });
    }
}