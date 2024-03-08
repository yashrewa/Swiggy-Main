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
const zod_1 = require("zod");
const Auth_1 = require("../middleware/Auth");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default('sk_test_51NwPdDSFBQprCYehxbsiZziOEipmZSfqQ3Xw824yBT5SPtUlLHli3UiqRcTEF3LYF9Bs2FQBfVXNYJxLqPgheRGx00sbAEFHTi', {
    apiVersion: '2023-08-16',
    typescript: true
});
const router = express_1.default.Router();
const signupValidate = zod_1.z.object({ email: zod_1.z.string().min(1), password: zod_1.z.string().min(8) });
const loginValidate = zod_1.z.object({ email: zod_1.z.string().min(1), password: zod_1.z.string().min(8) });
const restaurantValidate = zod_1.z.object({
    name: zod_1.z.string().min(1),
    cloudinaryImageId: zod_1.z.string().min(1),
    locality: zod_1.z.string().min(1),
    costForTwo: zod_1.z.number().min(1),
    avgRating: zod_1.z.number().min(1),
    isVeg: zod_1.z.boolean(),
    deliveryTime: zod_1.z.number().min(1)
});
const cartItems = zod_1.z.object({
    _id: zod_1.z.string(),
    name: zod_1.z.string().min(1),
    imageId: zod_1.z.string().min(1),
    price: zod_1.z.number().min(1),
    quantity: zod_1.z.number().min(1)
});
const arrayOfCartItems = zod_1.z.array(cartItems);
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const parsedInput = signupValidate.safeParse(req.body);
    if (!parsedInput.success) {
        return res.json({ message: parsedInput.error });
    }
    const isPresent = yield db_1.User.findOne({ email: email });
    if (isPresent) {
        return res.status(400).json({ message: "Email is already in use" });
    }
    const token = jsonwebtoken_1.default.sign({
        email,
        role: "user"
    }, Auth_1.secretKey, { expiresIn: "1h" });
    const user = new db_1.User({ email: email, password: password });
    yield user.save();
    res.json({ message: "user is registered", token });
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.headers;
    const parsedInput = loginValidate.safeParse(req.headers);
    if (!parsedInput.success) {
        return res.json({ message: parsedInput.error });
    }
    const isPresent = yield db_1.User.findOne({ email: email, password: password });
    if (isPresent) {
        const token = jsonwebtoken_1.default.sign({
            email,
            role: "user"
        }, Auth_1.secretKey, { expiresIn: "1h" });
        return res.json({ message: "welcome", token });
    }
    res.json();
}));
router.get('/me', Auth_1.Authenticate, (req, res) => {
    if (req.headers.email) {
        console.log(req.headers.email);
        res.json({ email: req.headers.email });
    }
});
router.get('/api/ping', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ message: 'Server Pinging is working successfully' });
    }
    catch (error) {
        console.log(res.status, error);
    }
}));
router.get('/restaurant-list', Auth_1.Authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.headers);
        const resList = yield db_1.Restaurant.find({});
        res.json({ message: "fetched succesfully", resList });
    }
    catch (error) {
        res.json({ message: error });
    }
}));
router.post('/create-checkout-session', Auth_1.Authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { items } = req.body;
        console.log(items);
        const result = arrayOfCartItems.safeParse(items);
        console.log(result);
        if (!result.success) {
            return res.status(400).json(result.error);
        }
        // res.json({message: "succesfully parsed"})
        const tranformedItems = items.map((item) => ({
            price_data: {
                currency: 'INR',
                product_data: {
                    name: item.name,
                    images: [item.imageId]
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));
        const session = yield stripe.checkout.sessions.create({
            line_items: tranformedItems,
            mode: 'payment',
            success_url: `https://swiggy-clone-j5gz.onrender.com/payment-success`,
            cancel_url: `https://swiggy-clone-j5gz.onrender.com/restaurant-list/payment-failed`
        });
        res.json({ url: session.url });
    }
    catch (err) {
        return res.send(err);
    }
}));
exports.default = router;
