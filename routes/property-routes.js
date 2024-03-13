const express = require("express");
const { getPropertyById, addProperty, updateProperty, removeProperty, getAllPropertiesByUser } = require("../controllers/property-controller");
const { verifyAdminToken } = require("../middleware/jwt-token");
const router = express.Router();

router.post('/id', getPropertyById);
router.put('/add', verifyAdminToken, addProperty);
router.put('/update/:id', updateProperty);
router.delete('/remove/:id', removeProperty)
router.get('/all', verifyAdminToken, getAllPropertiesByUser)

module.exports = router;