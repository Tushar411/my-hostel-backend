const express = require("express");
const { getAllRooms, addRoom, updateRoom, addMultipleRooms, updateMultipleRooms } = require("../controllers/room-controller");
const { addBed, addBedsAndRoom } = require("../controllers/bed-controller");
const router = express.Router();

router.get("/all/:propertyId", getAllRooms);
router.post("/add", addRoom);
router.post("/update/:roomId", updateRoom);
router.put("/add-multiple/:propertyId", addMultipleRooms);
router.put("/update-multiple/:propertyId", updateMultipleRooms)
//bed routes
router.post("/add-bed", addBed);

router.post("/add-multiple-beds", addBedsAndRoom);

module.exports = router;