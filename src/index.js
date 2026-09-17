import dotenv from "dotenv"
import app from "./app.js"
import connectDB from "./db.js"

dotenv.config(
    {
        path:"./.env"
    })

const PORT = process.env.PORT || 8000;

connectDB
    .then(()=>
        {
            app.listen(PORT , ()=>
                {
                    console.log(`🚀 Server is running at http://localhost:${PORT}`)
                })
        })
        .catch((err)=>
            {
                console.error("❌ Database connection failed, server startup aborted!", err);
            })