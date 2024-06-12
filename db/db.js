import mongoose from "mongoose"

const DB_URI = process.env.DB_URI

mongoose.connect(DB_URI)
.then(console.log("database connection is OK"))
.catch(error => {
    console.error("u have error: ", error)
    process.exit(1) 
})

