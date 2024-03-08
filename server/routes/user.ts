import express, {request} from 'express';
import jwt from 'jsonwebtoken';
import {Admin, Restaurant, RestaurantMenu, User} from '../db/db'
import mongoose from 'mongoose';
import {Request, Response} from 'express'
import {z} from 'zod'
import {secretKey, Authenticate} from '../middleware/Auth';
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51NwPdDSFBQprCYehxbsiZziOEipmZSfqQ3Xw824yBT5SPtUlLHli3UiqRcTEF3LYF9Bs2FQBfVXNYJxLqPgheRGx00sbAEFHTi', {
    apiVersion: '2023-08-16',
    typescript: true
});

const router = express.Router();

const signupValidate = z.object({email: z.string().min(1), password: z.string().min(8)})
const loginValidate = z.object({email: z.string().min(1), password: z.string().min(8)})
const restaurantValidate = z.object({
    name: z.string().min(1),
    cloudinaryImageId: z.string().min(1),
    locality: z.string().min(1),
    costForTwo: z.number().min(1),
    avgRating: z.number().min(1),
    isVeg: z.boolean(),
    deliveryTime: z.number().min(1)
})

interface Item{
    name: string;
    price: number;
    description: string;
    imageId: string;
    quantity: number;
}

const cartItems = z.object({
    _id: z.string(),
    name: z.string().min(1),
    imageId: z.string().min(1),
    price: z.number().min(1),
    quantity: z.number().min(1)
})

const arrayOfCartItems= z.array(cartItems)

router.post('/signup', async (req : Request, res : Response) => {
    const {email, password} = req.body;
    const parsedInput = signupValidate.safeParse(req.body);
    if (! parsedInput.success) {
        return res.json({message: parsedInput.error})
    }
    const isPresent = await User.findOne({email: email})
    if (isPresent) {
        return res.status(400).json({message: "Email is already in use"})
    }
    const token = jwt.sign({
        email,
        role: "user"
    }, secretKey, {expiresIn: "1h"})
    const user = new User({email: email, password: password})
    await user.save()
    res.json({message: "user is registered", token})
})

router.post('/login', async (req : Request, res : Response) => {
    const {email, password} = req.headers
    const parsedInput = loginValidate.safeParse(req.headers)
        if (! parsedInput.success) {
            return res.json({message: parsedInput.error})
    }
    const isPresent = await User.findOne({email: email, password: password})

    if (isPresent) {
        const token = jwt.sign({
            email,
            role: "user"
        }, secretKey, {expiresIn: "1h"})
        return res.json({message: "welcome", token})
    }
    res.json()
})

router.get('/me', Authenticate, (req : Request, res : Response) => {
    if (req.headers.email) {
        console.log(req.headers.email)
        res.json({email: req.headers.email})
    }
})

router.get('/api/ping', async (req: Request, res: Response) => {
    try {   
        res.status(200).json({message: 'Server Pinging is working successfully'})
    } catch (error) {
        console.log(res.status, error);
        
    }
})


router.get('/restaurant-list', Authenticate, async (req : Request, res : Response) => {
    try {
        console.log(req.headers)
        const resList = await Restaurant.find({})
        res.json({message: "fetched succesfully", resList})
    } catch (error) {
        res.json({message: error})
    }
})

router.post('/create-checkout-session', Authenticate ,async (req, res:Response) => {
    try{
        const {items} = req.body;
        console.log(items);
    
        const result = arrayOfCartItems.safeParse(items);
        console.log(result)
        if(!result.success){
            return res.status(400).json(result.error)
        }
    
        // res.json({message: "succesfully parsed"})
    
    
        const tranformedItems = items.map((item:Item)=> ({
            price_data: {
                currency: 'INR',
                product_data: {
                    name: item.name,
                    images: [item.imageId]
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))
    
        const session = await stripe.checkout.sessions.create({
            line_items: tranformedItems,
            mode: 'payment',
            success_url: `https://swiggy-clone-j5gz.onrender.com/payment-success`,
            cancel_url: `https://swiggy-clone-j5gz.onrender.com/restaurant-list/payment-failed`
        });
    
        res.json( {url: (session as any).url});
    }
    catch(err){
        return res.send(err)
    }
});


export default router;
