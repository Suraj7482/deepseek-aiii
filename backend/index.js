import express from 'express'
const app = express()
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from "./routes/user.routes.js"
import promptRoutes from "./routes/prompt.route.js"
import cookieParser from 'cookie-parser'


dotenv.config()




const port =process.env.PORT || 4004
const MONGODB_URL = process.env.MONGODB_URI
//middleware

app.use(express.json())
app.use(cookieParser())

mongoose.connect(MONGODB_URL)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error)
  })

//app.get('/', (req, res) => {
  //res.send('Hello Wld!')
//})

//routes

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/deepseekai", promptRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
