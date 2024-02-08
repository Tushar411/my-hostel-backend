const Bed = require("../models/bed");
const Room = require("../models/room");

// ADD bed
const addBed = async (req, res) => {
    const data = req.body;
    try{
        const newBed = new Bed({...data});
        const savedBed = await newBed.save();

        await Room.findByIdAndUpdate(data.roomId, { $push: { beds: savedBed } }, { new: true });
        return res.status(200).json({data: savedBed, code: 200, status_code: "success", message: "Bed added successfully"})
    }
    catch (error) {
        return res.status(500).json({code:500, status_code: "something went wrong"})
    }
}

// ADD multiple beds and a room
const addBedsAndRoom = async (req, res) => {
    const data = req.body;

    try {
        // Create the room
        const newRoom = new Room(data.room);
        const savedRoom = await newRoom.save();

        // Add the room's ID to each bed
        const bedsData = data.beds.map((bed) => ({ ...bed, roomId: savedRoom._id }));

        // Create and save multiple beds
        const savedBeds = await Bed.insertMany(bedsData);

        // Update the room's beds array with the IDs of the newly created beds
        const updatedRoom = await Room.findByIdAndUpdate(
            savedRoom._id,
            { $push: { beds: { $each: savedBeds.map((bed) => bed._id) } } },
            { new: true }
        );

        return res.status(200).json({
            data: { room: updatedRoom, beds: savedBeds },
            code: 200,
            status_code: "success",
            message: "Beds and Room added successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            status_code: "error",
            message: "Something went wrong",
        });
    }
};

//UPDATE bed
// const updateBed = async (req, res) => {
//     const data = req.body;
//     try {

//     }
//     catch (error) {

//     }
// }

module.exports = {
    addBed, addBedsAndRoom
}