import express, {Request, Response} from 'express';
import mongoose from 'mongoose'
import fs from 'fs'
import cors from 'cors';
import adminRoutes from './routes/admin'
import userRoutes from './routes/user'
const app = express()

app.use(cors())
app.use(express.json())

app.use('/admin', adminRoutes)
app.use('/user', userRoutes)

mongoose.connect(`mongodb+srv://yashrewa00:21Savage@cluster0.3z81dfx.mongodb.net/Swiggy?retryWrites=true&w=majority`)

// mongoose.connect(`${process.env.MONGODB_CONNECT_URI}`)
const port = process.env.PORT || 3000;

app.listen(port)
