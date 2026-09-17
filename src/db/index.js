import sqlite3 from "sqlite3"
import path from "path"
import { DB_NAME } from "../constants.js"


const dbPath = path.resolve(process.cwd() , DB_NAME)


const connectDB =()=>
    {
        return new  Promise((resolve , reject)=>
            {
                const db = new sqlite3.Database(dbPath ,  (err)=>
                    {
                        if(err)
                            {
                                console.error("❌ SQLite connection failed:", err.message)
                                reject(err)
                            }
                        else{
                            console.log(`\n⚙️ SQLite connected successfully! File: ${dbPath}`)
                            resolve(db)
                        }
                    })
            })
    }

export default connectDB