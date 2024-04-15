import LeadsModel from "../Models/Leads.js";
import csv from 'csvtojson';
import xlsx from 'xlsx'; // or import exceljs from 'exceljs';
import LeadsStatus from "../Models/LeadsStatus.js";

export const uploadLeads = async (req, res) => {
    try {
        // Convert Excel file to CSV format
        const workbook = xlsx.readFile(req.file.path);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const csvData = xlsx.utils.sheet_to_csv(worksheet);

        // Parse CSV data to JSON using csvtojson
        csv().fromString(csvData).then(async (response) => {
            const filteredData = response.map(obj => {
                if (obj.Name.trim() !== '' || obj.Phone.trim() !== '') {
                    return {
                        name: obj.Name.trim(),
                        email: obj.Email.trim(),
                        phone: obj.Phone.trim(),
                        source: obj.Source.trim()
                    };
                }
                return null;
            }).filter(obj => obj !== null);
            await LeadsModel.insertMany(filteredData);
        });

        res.status(200).json({ message: 'File uploaded successfully' });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ message: err.message });
    }
};

export const getLeads = async (req, res) => {
    const { type } = req.query;
    const queries = {};
    if(!req.validationData.isAdmin){
        queries.$or = [{ generalManagerID: req.validationData._id }, { managerID: req.validationData._id }, { employeeID: req.validationData._id }];
    }
    if (type === 'assigned') {
        queries.isAssigned = true;
    } else if (type === 'unassigned') {
        queries.isAssigned = false;
    }
    try {
        const leads = await LeadsModel.find(queries);
        res.status(200).json(leads);
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ message: err.message });
    }
};

export const getLeadsByEmployeeID = async (req, res) => {
    try {
        const { employeeID } = req.params;

        // Validate if employeeID is provided
        if (!employeeID) {
            return res.status(400).json({ message: 'EmployeeID is required' });
        }

        // Find all leads assigned to the specified employeeID
        const leads = await LeadsStatus.find({ EmployeeID: employeeID });

        res.status(200).json(leads);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getLeadsByID = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate if employeeID is provided
        if (!id) {
            return res.status(400).json({ message: 'id is required' });
        }

        // Find all leads assigned to the specified employeeID
        const leads = await LeadsModel.findById(id);

        res.status(200).json(leads);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
