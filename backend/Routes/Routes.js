const express = require('express');
const router = express.Router();
const {
    Generate_otp,
    Verify_otp,
    Verify_coupon,
    Getall,
    Getcart,
    Getproduct,
    Addcart,
    Deleteitem,
    IncreaseProductQuantity,
    DecreaseProductQuantity
} = require("../controllers/cartcontrollers.js");
const cart_QR = require("../controllers/QRcontroller.js");
const authenticateUser = require('../Middlewares/authmiddleware.js');

router.post("/send_otp", Generate_otp);
router.post("/verify_otp", Verify_otp);
router.get("/get_product", Getproduct);

// Protected routes (authentication required)
router.post("/verify_coupon", authenticateUser, Verify_coupon);
router.get("/all_users", authenticateUser, Getall);
router.get("/user_cart", authenticateUser, Getcart);
router.post("/add_to_cart", authenticateUser, Addcart);
router.delete("/del_item", authenticateUser, Deleteitem);
router.patch("/Inc_prod", authenticateUser, IncreaseProductQuantity);
router.patch("/Dec_prod", authenticateUser, DecreaseProductQuantity);
router.get("/generate_QR", authenticateUser, cart_QR);

module.exports = router;
