import express from 'express';
import jwt from 'jsonwebtoken';
import {Admin, Restaurant, RestaurantMenu, User} from '../db/db'
import mongoose from 'mongoose';
import {Request, Response} from 'express'
import { z } from "zod"
import {secretKey, Authenticate} from '../middleware/Auth';


const router = express.Router();

// ZOD Validation below

const signupValidate = z.object({email: z.string().min(1), password: z.string().min(8)})
const loginValidate = z.object({email: z.string().min(1), password: z.string().min(8)})
const restaurantValidate = z.object({
    name: z.string().min(1),
    cloudinaryImageId: z.string().min(1),
    locality: z.string().min(1),
    area: z.string().min(1),
    costForTwo: z.number().min(1),
    avgRating: z.number().min(1),
    isVeg: z.boolean(),
    deliveryTime: z.number().min(1)
})


// typescript type-alias below


router.post('/signup', async (req : Request, res : Response) => {
    const parsedInput = signupValidate.safeParse(req.body);
    const {email, password} = req.body;
    if (! parsedInput.success) {
        return res.json({message: parsedInput.error})
    }
    console.log(email, password)
    const existingAdmin = await Admin.findOne({email: email});
    if (existingAdmin) {
        return res.json({message: 'email already registered!'});
    } else {
        const newAdmin = new Admin({email, password});
        await newAdmin.save();
        const token = jwt.sign({
            email,
            role: 'admin'
        }, secretKey, {expiresIn: '1h'})
        res.json({message: "New Admin", token})
    }
})

router.post('/login', async (req : Request, res : Response) => {
    try {
        const parsedInput = loginValidate.safeParse(req.headers)
        if (! parsedInput.success) {
            return res.json({message: parsedInput.error})
        }
        const {email, password} = req.headers;
        console.log(req.headers)
        const user = await Admin.findOne({email: req.headers.email, password: req.headers.password});
        console.log(user)
        if (user && email) {
            const token = jwt.sign({
                email,
                role: "admin"
            }, secretKey, {expiresIn: '1h'})
            res.json({message: "Logged in successfully", token});
        } else {
            res.json({message: "User Authentication Failed"})
        }
    } catch (error) {
        console.log(error);
    }

})

router.get('/restaurant-list', Authenticate, async (req : Request, res : Response) => {
    try {
        console.log(req.headers.email)
        const restaurantList = await Restaurant.find({});
        if (!restaurantList) {
            return res.status(404).json({message: "Empty"})
        }
        return res.json(restaurantList);
    } catch (error) {
        res.json(error)
        console.log(error);
    }
})

router.post('/add-restaurant', Authenticate, async (req : Request, res : Response) => {
    try {
        const resData = {
            ...req.body
        };
        const parsedInput = restaurantValidate.safeParse(req.body)
        console.log(req.body);
        console.log(parsedInput.success);

        if (! parsedInput.success) {
            return res.status(404).json({message: parsedInput.error})
        }
        const retrievedRestaurantList = await Restaurant.find({})
        const isPresent = retrievedRestaurantList.find((restaurant) => restaurant.name === resData.name)
        if (resData && parsedInput.success && ! isPresent) {
            const newRestaurant = new Restaurant({
                ... resData
            })
            await newRestaurant.save();
            res.json({message: 'Restaurant added successfully'})
        } else {
            res.status(404).json({message: 'Unable to add restaurant'})
        }
    } catch (error) {
        res.json(error)
        console.log(error);
    }
})

router.post('/add-food/:resId', Authenticate, async (req : Request, res : Response) => {
    try {
        const resId = req.params.resId;
        const courseIdObjectId = new mongoose.Types.ObjectId(resId);
        const resData = {...req.body}
        console.log(resData)
        const newItem = new RestaurantMenu(resData)
        await newItem.save();

        const restaurant = await Restaurant.findById(courseIdObjectId)
        if (restaurant) {
            restaurant.menu.push(newItem._id)
            await restaurant.save()
        }
        res.json({restaurant, newItem})
        // console.log(restaurant);
        // if (restaurant) {
        // } else {
        //     return res.json({message: "item already present"})
        // }
    } catch (err) {
        res.status(404).json({message: err})
        console.log(err)
    }
})
// router.post('/add-food/:resId', Authenticate, async (req : Request, res : Response) => {
//     try {
//         const id = req.params.resId;

//         const resData = {...req.body}
//         const restaurant = await Restaurant.findById(id);
//         console.log(restaurant);

//         if (restaurant) {
//             const newItem = new RestaurantMenu({
//                 ... resData,
//                 res_id: restaurant._id
//             })
//             if (newItem !== undefined) {
//                 newItem.info.push(restaurant._id);
//                 await newItem.save();
//             }
//             res.json({message: "item added successfully"})
//         } else {
//             return res.json({message: "item already present"})
//         }
//     } catch (err) {
//         res.status(404).json({message: err})
//         console.log(err)
//     }
// })

router.get('/restaurant-details/:id', Authenticate, async (req : Request, res : Response) => {
    try {
        const id = req.params.id;
        if (id) {
            const restaurantInfo = await Restaurant.findById(id).populate('menu')
            console.log(restaurantInfo)
            if (! restaurantInfo) {
                res.status(401).json({message: "No food related this restaurant available"})
            }
            res.json({message: "these are all restaurants speciality", restaurantInfo})
        }
    } catch (error) {
        res.json({message: error})
    }

})
// router.get('/restaurant-details/:id', Authenticate, async (req : Request, res : Response) => {
//     try {

//         const id = req.params.id;
//         const restaurantObjectId = new mongoose.Types.ObjectId(id)
//         if (restaurantObjectId) {
//             const restaurantInfo = await RestaurantMenu.find({res_id: restaurantObjectId}).populate('info')
//             console.log(restaurantInfo)
//             if (! restaurantInfo) {
//                 res.status(401).json({message: "No food related this restaurant available"})
//             }
//             res.json({message: "these are all restaurants", restaurantInfo})
//         }
//     } catch (error) {
//         res.json({message: error})
//     }

// })

router.post('/restaurant-delete/:id',Authenticate, async(req:Request, res:Response)=>{
    try{
        const resId = req.params.id;
        console.log(resId)
        const cusineId = req.body.cusineId;
        console.log(cusineId)
    
        const restaurant = await Restaurant.findById(resId)
        if(restaurant){
            restaurant.menu = restaurant.menu.filter(item => item.toString() !==cusineId)
            await restaurant.save()
            const cusine = await RestaurantMenu.findByIdAndDelete(req.body.cusineId)
            res.json({restaurant,cusine})
        }
    }
    catch(err){
        res.json({message: err})
    }
})


export default router
