const Property = require('../models/property');
const Room = require('../models/room');

// get all rooms by propertyId
const getAllRooms = async (req, res) => {
    const { propertyId } = req.params
    try {
        const rooms = await Room.find({ propertyId: propertyId })
        // .sort({'name': 1});

        return res.status(200).json({ data: rooms, code: 200, status_code: "success", message: "Rooms fetched successfull" });
    }
    catch (error) {
        return res.status(500).json({ code: 500, status_code: "error" });
    }
}

// add single room 
const addRoom = async (req, res) => {
    const data = req.body;
    try {
        const newRoom = new Room({
            ...data
        })
        const savedRoom = await newRoom.save();
        // Update the corresponding property's rooms array
        await Property.findByIdAndUpdate(data.propertyId, { $push: { rooms: savedRoom } }, { new: true });

        return res.status(201).json({ data: savedRoom, code: 201, status_code: "success", message: "Room added successfully" })
    }
    catch (error) {
        if (error.name === 'MongoServerError' && error.code === 11000) {
            // Duplicate key error (unique constraint violation)
            const duplicateKeyInfo = error.keyValue;
            return res.status(400).json({
                code: 400,
                status_code: "validation_error",
                message: `Room with the name '${duplicateKeyInfo.name}' already exists for this property`
            });
        } else {
            console.error(error);
            return res.status(500).json({
                code: 500,
                status_code: "error",
                message: "Internal Server Error"
            });
        }
    }
}

// update single Room
const updateRoom = async (req, res) => {
    const { roomId } = req.params;
    const updateData = req.body;

    try {
        // Find the room and update its details
        const updatedRoom = await Room.findByIdAndUpdate(roomId, updateData, { new: true });

        if (!updatedRoom) {
            return res.status(404).json({
                code: 404,
                status_code: "not_found",
                message: "Room not found"
            });
        }

        // // Check if there are bed IDs to delete
        // if (updateData.bedsToDelete && updateData.bedsToDelete.length > 0) {
        //     // Remove the specified bed IDs from the room's beds array
        //     updatedRoom.beds = updatedRoom.beds.filter(bedId => !updateData.bedsToDelete.includes(bedId));

        //     // Delete the specified beds from the Bed collection
        //     await Bed.deleteMany({ _id: { $in: updateData.bedsToDelete } });
        // }

        // Save the updated room
        const savedRoom = await updatedRoom.save();

        return res.status(200).json({
            data: savedRoom,
            code: 200,
            status_code: "success",
            message: "Room updated successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            status_code: "error",
            message: "Internal Server Error"
        });
    }
};

//add multiple Room
const addMultipleRooms = async (req, res) => {
    const { propertyId } = req.params;
    const roomsData = req.body;
    try {
        const roomNames = roomsData.map((roomData) => roomData.name);
        const duplicateRooms = await checkForDuplicateRooms(propertyId, roomNames);

        if (duplicateRooms.length > 0) {
            return res.status(400).json({
                code: 400,
                status_code: "validation_error",
                message: `Duplicate rooms: ${duplicateRooms.map((room) => room.name).join(", ")}`,
            });
        }

        const savedRooms = await Promise.all(roomsData.map(async (roomData) => {
            const newRoom = new Room({
                ...roomData,
                propertyId: propertyId
            })

            return await newRoom.save()
        }));

        await Property.findByIdAndUpdate(propertyId, { $push: { rooms: { $each: savedRooms } } }, { new: true });

        return res.status(201).json({ data: savedRooms, code: 201, status_code: "success", message: "Rooms added successfully" })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ code: 500, status_code: "something went wrong" })
    }
}


//check duplicate rooms
const checkForDuplicateRooms = async (propertyId, roomNames) => {
    const existingRooms = await Room.find({
        name: { $in: roomNames },
        propertyId: propertyId,
    });

    const duplicateRooms = [];
    existingRooms.forEach((existingRoom) => {
        duplicateRooms.push({
            name: existingRoom.name,
            propertyId: existingRoom.propertyId,
        });
    });

    return duplicateRooms;
};


//update/add multiple rooms
const updateMultipleRooms = async (req, res) => {
    const { propertyId } = req.params;
    const roomUpdates = req.body;

    try {
        let encounteredRoomNames = new Set();
        const updatedRooms = await Promise.all(
            roomUpdates.map(async (roomUpdate) => {
                const { name, ...newData } = roomUpdate;
                  // Check if the room name has already been encountered in the current iteration
                if (encounteredRoomNames.has(name)) {
                    return res.status(400).json({
                        code: 400,
                        status_code: "error",
                        message: `Duplicate room name found: ${name}`
                    });
                }

                // Add the room name to the Set to avoid duplicates within the current iteration
                encounteredRoomNames.add(name);

                // Check if a room with the same name and propertyId exists
                const existingRoom = await Room.findOne({ name, propertyId });

                if (existingRoom) {
                    // If the room exists, update it
                    const updatedRoom = await Room.findByIdAndUpdate(existingRoom._id, newData, { new: true });

                    return updatedRoom;
                } else {
                    // If the room doesn't exist, create a new one
                    const newRoom = new Room({ ...roomUpdate });
                    const savedRoom = await newRoom.save();

                    return savedRoom;
                }
            })
        );
        // Find and delete rooms that have the same propertyId but are not present in roomUpdates
        const deletedRooms = await Room.find({ propertyId, _id: { $nin: updatedRooms.map(room => room._id) } });

        // Use a single deleteMany query to delete rooms and update the Property's rooms array
        const deletionResult = await Room.deleteMany({ propertyId, _id: { $in: deletedRooms.map(room => room._id) } });

        // Update the Property's rooms array
        await Property.findByIdAndUpdate(
            propertyId,
            { $pullAll: { rooms: deletedRooms.map(room => room._id) } }
        );

        // Find the Property by propertyId and update its rooms array
        const updatedProperty = await Property.findOneAndUpdate(
            { _id: propertyId },
            { $addToSet: { rooms: { $each: updatedRooms.map(room => room._id) } } },
            { new: true }
        );
        return res.status(200).json({ data: updatedRooms, deleted: deletedRooms, property: updatedProperty, code: 200, status_code: "success", message: "Rooms updated and added successfully" });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ code: 500, status_code: "error", message: "Something went wrong during update", error: error.message });
    }
};


module.exports = {
    getAllRooms,
    addRoom,
    updateRoom,
    addMultipleRooms,
    updateMultipleRooms
}