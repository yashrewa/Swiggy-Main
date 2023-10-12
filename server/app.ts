import express, {Request, Response} from 'express';
import mongoose from 'mongoose'
import cors from 'cors';
import adminRoutes from './routes/admin'
import userRoutes from './routes/user'
const app = express()

app.use(cors())

app.use(cors({
    origin: 'https://swiggy-main.vercel.app',
    
}))
// app.use(express.json())

app.use('/admin', adminRoutes)
app.use('/user', userRoutes)

mongoose.connect(`mongodb+srv://yashrewa00:21Savage@cluster0.fngj58u.mongodb.net/swiggy?retryWrites=true&w=majority`)

// mongoose.connect(`${process.env.MONGODB_CONNECT_URI}`)

// const PORT = process.env.PORT;

app.listen(3000)
