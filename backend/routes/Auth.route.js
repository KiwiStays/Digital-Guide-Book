import { Router } from "express";
// import authenticate from "../middlewares/auth";
import { login, loginAdmin, logout, RegisterAdmin, verifyAdminToken, verifyOTP, verifyToken } from "../controllers/auth.controller.js";

const router =  Router();

router.route("/login").post(login);
// router.route("/logout").post(authenticate, logout);
router.route("/verify").post(verifyOTP);
router.route("/protected").get(verifyToken, (req, res) => {
    res.status(200).json({ message: 'Token is valid', guest: req.guest });
});
router.route("/admin/login").post(loginAdmin);
router.route("/admin/register").post(RegisterAdmin);
router.route("/admin/profile").get(verifyAdminToken, (req, res) => {
    res.json({ message: 'Access granted' });
});

export default router;
