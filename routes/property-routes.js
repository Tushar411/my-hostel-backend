const express = require("express");
const { getPropertyById, addProperty, updateProperty, removeProperty } = require("../controllers/property-controller");
const router = express.Router();

router.post('/id', getPropertyById);
router.put('/add', addProperty);
router.put('/update/:id', updateProperty);
router.delete('/remove/:id', removeProperty)

module.exports = router;