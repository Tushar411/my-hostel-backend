const Property = require('../models/property');
const Room = require('../models/room');
const User = require('../models/user')

//get property by id
const getPropertyById = async (req, res) => {
    const { id } = req.body;
    try {
        const property = await Property.findOne({ _id: id })
        if (!property) {
            return res.status(404).json({ code: 404, status_code: "not_found", message: "Property not found" });
        }
        return res.status(200).json({ data: property, status_code: "success", message: "property fetched successfully" })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ code: 500, status_code: error, message: "something went wrong" })
    }
}

// add property
const addProperty = async (req, res) => {
    const {userId} = req.user
    const data = req.body;
    try {
        const newProperty = await new Property({
            ...data, ownerId: userId
        })
        const savedProperty = await newProperty.save();
        return res.status(200).json({ data: savedProperty, code: 200, status_code: "success", message: "property added successfully" })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ code: 500, status_code: "error", message: "error in adding property" })
    }
}

// Update property
const updateProperty = async (req, res) => {
    const { id } = req.params; 
    const updatedData = req.body;
    try {
        const updatedProperty = await Property.findOneAndUpdate({ _id: id }, updatedData, { new: true });
        if (!updatedProperty) {
            return res.status(404).json({ code: 404, status_code: "not_found", message: "Property not found" });
        }
        return res.status(200).json({ data: updatedProperty, code: 200, status_code: "success", message: "Property updated successfully" });
    } catch (error) {
        return res.status(500).json({ code: 500, status_code: "error", message: "Something went wrong" });
    }
}

// delete property
const removeProperty = async (req, res) => {
    const { id } = req.params;
    try {
        const property = await Property.findByIdAndDelete(id);
        if (!property) {
            return res.status(404).json({ code: 404, status_code: "not_found", message: "Property not found" });
        }
        return res.status(200).json({ code: 200, status_code: "success", message: "property deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ code: 500, status_code: "error", message: "something went wrong" })
    }
}

//get All admin user Properties 
const getAllPropertiesByUser = async (req, res) => {
    const {userId} = req.user
    try {
        const allProperties = await Property.find({ownerId: userId});

        const propertiesWithDetails = [];

        // Iterate through each property
        for (const property of allProperties) {
            // Count the total number of rooms for each property
            const totalRooms = await Room.countDocuments({ propertyId: property._id });

            // Initialize counts for beds, tenants, and total collection
            let totalBeds = 0;
            let totalTenants = 0;
            let totalCollection = 0;
            let occupiedBeds = 0;

            // Iterate through each room to calculate beds and tenants
            const rooms = await Room.find({ propertyId: property._id });
            rooms.forEach(room => {
                totalBeds += room.beds.length;
                room.beds.forEach(bed => {
                    occupiedBeds += bed.status === 'OCCUPIED' ? 1 : 0;
                });
            });

            // Calculate the total tenants and collection for each property directly from the User table
            const usersInProperty = await User.find({ 'properties.tPropertyId': property._id });

            // Iterate through each user in the property
            usersInProperty.forEach(user => {
                totalTenants += 1; // Increment totalTenants for each user in the property

                // Sum up paid amounts from the paymentHistory array
                user.paymentHistory.forEach(paymentLog => {
                    totalCollection += paymentLog.paidAmount;
                });
            });

            // Push the property details with counts to the array
            propertiesWithDetails.push({
                property,
                totalRooms,
                occupiedBeds,
                totalBeds,
                totalTenants,
                totalCollection
            });
        }


        return res.status(200).json({data: propertiesWithDetails, code:200, status_code: "success", message: "properties fetched successfully"})
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({code:500, status_code: "error"})
    }
}

module.exports = { getPropertyById, addProperty, updateProperty, removeProperty, getAllPropertiesByUser }