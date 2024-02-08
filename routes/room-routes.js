const express = require("express");
const { getAllRooms, addRoom, updateRoom, addMultipleRooms } = require("../controllers/room-controller");
const { addBed, addBedsAndRoom } = require("../controllers/bed-controller");
const router = express.Router();

router.get("/all-rooms", getAllRooms);
router.post("/add", addRoom);
router.post("/update/:roomId", updateRoom);
router.put("/add-multiple/:propertyId", addMultipleRooms);
//bed routes
router.post("/add-bed", addBed);

router.post("/add-multiple-beds", addBedsAndRoom);

module.exports = router;