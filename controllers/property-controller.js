const Property = require('../models/property');

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
    const data = req.body;
    try {
        const newProperty = new Property({
            ...data
        })
        const savedProperty = await newProperty.save();
        return res.status(200).json({ data: savedProperty, code: 200, status_code: "success", message: "property added successfully" })
    }
    catch (error) {
        return res.status(500).json({ code: 500, status_code: "error", message: "error in adding property" })
    }
}

// Update property
const updateProperty = async (req, res) => {
    const { id } = req.params; // Assuming the property id is in the request params
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


module.exports = { getPropertyById, addProperty, updateProperty, removeProperty }