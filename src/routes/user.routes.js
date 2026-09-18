import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { registerUser , loginUser , logoutUser} from "../controllers/user.controller.js";

const router = Router()


// Public routes
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

// Protected routes
router.route("/logout").get(verifyJwt, logoutUser)
router.route("/me").get(verifyJwt , (req , res)=>
    {
        return res.status(200).json({success:true , user: req.user})
    })

export default router