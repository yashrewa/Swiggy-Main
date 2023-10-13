"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db/db");
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const Auth_1 = require("../middleware/Auth");
const router = express_1.default.Router();
// ZOD Validation below
const signupValidate = zod_1.z.object({ email: zod_1.z.string().min(1), password: zod_1.z.string().min(8) });
const loginValidate = zod_1.z.object({ email: zod_1.z.string().min(1), password: zod_1.z.string().min(8) });
const restaurantValidate = zod_1.z.object({
    name: zod_1.z.string().min(1),
    cloudinaryImageId: zod_1.z.string().min(1),
    locality: zod_1.z.string().min(1),
    area: zod_1.z.string().min(1),
    costForTwo: zod_1.z.number().min(1),
    avgRating: zod_1.z.number().min(1),
    isVeg: zod_1.z.boolean(),
    deliveryTime: zod_1.z.number().min(1)
});
// typescript type-alias below
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = signupValidate.safeParse(req.body);
    const { email, password } = req.body;
    if (!parsedInput.success) {
        return res.json({ message: parsedInput.error });
    }
    console.log(email, password);
    const existingAdmin = yield db_1.Admin.findOne({ email: email });
    if (existingAdmin) {
        return res.json({ message: 'email already registered!' });
    }
    else {
        const newAdmin = new db_1.Admin({ email, password });
        yield newAdmin.save();
        const token = jsonwebtoken_1.default.sign({
            email,
            role: 'admin'
        }, Auth_1.secretKey, { expiresIn: '1h' });
        res.json({ message: "New Admin", token });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedInput = loginValidate.safeParse(req.headers);
        if (!parsedInput.success) {
            return res.json({ message: parsedInput.error });
        }
        const { email, password } = req.headers;
        console.log(req.headers);
        const user = yield db_1.Admin.findOne({ email: req.headers.email, password: req.headers.password });
        console.log(user);
        if (user && email) {
            const token = jsonwebtoken_1.default.sign({
                email,
                role: "admin"
            }, Auth_1.secretKey, { expiresIn: '1h' });
            res.json({ message: "Logged in successfully", token });
        }
        else {
            res.json({ message: "User Authentication Failed" });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
router.get('/restaurant-list', Auth_1.Authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.headers.email);
        const restaurantList = yield db_1.Restaurant.find({});
        if (!restaurantList) {
            return res.status(404).json({ message: "Empty" });
        }
        return res.json(restaurantList);
    }
    catch (error) {
        res.json(error);
        console.log(error);
    }
}));
router.post('/add-restaurant', Auth_1.Authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resData = Object.assign({}, req.body);
        const parsedInput = restaurantValidate.safeParse(req.body);
        console.log(req.body);
        console.log(parsedInput.success);
        if (!parsedInput.success) {
            return res.status(404).json({ message: parsedInput.error });
        }
        const retrievedRestaurantList = yield db_1.Restaurant.find({});
        const isPresent = retrievedRestaurantList.find((restaurant) => restaurant.name === resData.name);
        if (resData && parsedInput.success && !isPresent) {
            const newRestaurant = new db_1.Restaurant(Object.assign({}, resData));
            yield newRestaurant.save();
            res.json({ message: 'Restaurant added successfully' });
        }
        else {
            res.status(404).json({ message: 'Unable to add restaurant' });
        }
    }
    catch (error) {
        res.json(error);
        console.log(error);
    }
}));
router.post('/add-food/:resId', Auth_1.Authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resId = req.params.resId;
        const courseIdObjectId = new mongoose_1.default.Types.ObjectId(resId);
        const resData = Object.assign({}, req.body);
        console.log(resData);
        const newItem = new db_1.RestaurantMenu(resData);
        yield newItem.save();
        const restaurant = yield db_1.Restaurant.findById(courseIdObjectId);
        if (restaurant) {
            restaurant.menu.push(newItem._id);
            yield restaurant.save();
        }
        res.json({ restaurant, newItem });
        // console.log(restaurant);
        // if (restaurant) {
        // } else {
        //     return res.json({message: "item already present"})
        // }
    }
    catch (err) {
        res.status(404).json({ message: err });
        console.log(err);
    }
}));
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
router.get('/restaurant-details/:id', Auth_1.Authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (id) {
            const restaurantInfo = yield db_1.Restaurant.findById(id).populate('menu');
            console.log(restaurantInfo);
            if (!restaurantInfo) {
                res.status(401).json({ message: "No food related this restaurant available" });
            }
            res.json({ message: "these are all restaurants speciality", restaurantInfo });
        }
    }
    catch (error) {
        res.json({ message: error });
    }
}));
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
router.post('/restaurant-delete/:id', Auth_1.Authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resId = req.params.id;
        console.log(resId);
        const cusineId = req.body.cusineId;
        console.log(cusineId);
        const restaurant = yield db_1.Restaurant.findById(resId);
        if (restaurant) {
            restaurant.menu = restaurant.menu.filter(item => item.toString() !== cusineId);
            yield restaurant.save();
            const cusine = yield db_1.RestaurantMenu.findByIdAndDelete(req.body.cusineId);
            res.json({ restaurant, cusine });
        }
    }
    catch (err) {
        res.json({ message: err });
    }
}));
exports.default = router;
