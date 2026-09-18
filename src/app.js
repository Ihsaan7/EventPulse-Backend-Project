import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import { errorHandler } from "./middleware/error.middleware.js"


const app = express();
//========== MIDDLEWARES ==================
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true , limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
//========== MIDDLEWARES ==================

// ========== HEALTH & STATUS ROUTES =======
app.get("/" , (req , res)=>
    {
        res.send("EventPulse is running")
    })
app.get("/health", (req , res)=>
    {
        res.status(200).json(
            {
                status:"OK",
                message:"Server is healtht and ready to accept requests",
                timestamp:new Date().toISOString()
            })
    })
// ========== HEALTH & STATUS ROUTES =======

// ========== ROUTES ========================
app.use("/api/v1/users" , userRouter)
// ========== ROUTES ========================



// ========== GLOBAL ERROR HANDLER =========
app.use(errorHandler)
// ========== GLOBAL ERROR HANDLER =========
export default app;