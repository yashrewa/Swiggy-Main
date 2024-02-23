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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var jsonwebtoken_1 = require("jsonwebtoken");
var db_1 = require("../db/db");
var zod_1 = require("zod");
var Auth_1 = require("../middleware/Auth");
var stripe_1 = require("stripe");
var stripe = new stripe_1.default('sk_test_51NwPdDSFBQprCYehxbsiZziOEipmZSfqQ3Xw824yBT5SPtUlLHli3UiqRcTEF3LYF9Bs2FQBfVXNYJxLqPgheRGx00sbAEFHTi', {
    apiVersion: '2023-08-16',
    typescript: true
});
var router = express_1.default.Router();
var signupValidate = zod_1.z.object({ email: zod_1.z.string().min(1), password: zod_1.z.string().min(8) });
var loginValidate = zod_1.z.object({ email: zod_1.z.string().min(1), password: zod_1.z.string().min(8) });
var restaurantValidate = zod_1.z.object({
    name: zod_1.z.string().min(1),
    cloudinaryImageId: zod_1.z.string().min(1),
    locality: zod_1.z.string().min(1),
    costForTwo: zod_1.z.number().min(1),
    avgRating: zod_1.z.number().min(1),
    isVeg: zod_1.z.boolean(),
    deliveryTime: zod_1.z.number().min(1)
});
var cartItems = zod_1.z.object({
    _id: zod_1.z.string(),
    name: zod_1.z.string().min(1),
    imageId: zod_1.z.string().min(1),
    price: zod_1.z.number().min(1),
    quantity: zod_1.z.number().min(1)
});
var arrayOfCartItems = zod_1.z.array(cartItems);
router.post('/signup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, parsedInput, isPresent, token, user;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                parsedInput = signupValidate.safeParse(req.body);
                if (!parsedInput.success) {
                    return [2 /*return*/, res.json({ message: parsedInput.error })];
                }
                return [4 /*yield*/, db_1.User.findOne({ email: email })];
            case 1:
                isPresent = _b.sent();
                if (isPresent) {
                    return [2 /*return*/, res.status(400).json({ message: "Email is already in use" })];
                }
                token = jsonwebtoken_1.default.sign({
                    email: email,
                    role: "user"
                }, Auth_1.secretKey, { expiresIn: "1h" });
                user = new db_1.User({ email: email, password: password });
                return [4 /*yield*/, user.save()];
            case 2:
                _b.sent();
                res.json({ message: "user is registered", token: token });
                return [2 /*return*/];
        }
    });
}); });
router.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, parsedInput, isPresent, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.headers, email = _a.email, password = _a.password;
                parsedInput = loginValidate.safeParse(req.headers);
                if (!parsedInput.success) {
                    return [2 /*return*/, res.json({ message: parsedInput.error })];
                }
                return [4 /*yield*/, db_1.User.findOne({ email: email, password: password })];
            case 1:
                isPresent = _b.sent();
                if (isPresent) {
                    token = jsonwebtoken_1.default.sign({
                        email: email,
                        role: "user"
                    }, Auth_1.secretKey, { expiresIn: "1h" });
                    return [2 /*return*/, res.json({ message: "welcome", token: token })];
                }
                res.json();
                return [2 /*return*/];
        }
    });
}); });
router.get('/me', Auth_1.Authenticate, function (req, res) {
    if (req.headers.email) {
        console.log(req.headers.email);
        res.json({ email: req.headers.email });
    }
});
router.get('/restaurant-list', Auth_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resList, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log(req.headers);
                return [4 /*yield*/, db_1.Restaurant.find({})];
            case 1:
                resList = _a.sent();
                res.json({ message: "fetched succesfully", resList: resList });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.json({ message: error_1 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/create-checkout-session', Auth_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var items, result, tranformedItems, session, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                items = req.body.items;
                console.log(items);
                result = arrayOfCartItems.safeParse(items);
                console.log(result);
                if (!result.success) {
                    return [2 /*return*/, res.status(400).json(result.error)];
                }
                tranformedItems = items.map(function (item) { return ({
                    price_data: {
                        currency: 'INR',
                        product_data: {
                            name: item.name,
                            images: [item.imageId]
                        },
                        unit_amount: item.price * 100
                    },
                    quantity: item.quantity
                }); });
                return [4 /*yield*/, stripe.checkout.sessions.create({
                        line_items: tranformedItems,
                        mode: 'payment',
                        success_url: "https://swiggy-clone-j5gz.onrender.com/payment-success",
                        cancel_url: "https://swiggy-clone-j5gz.onrender.com/restaurant-list/payment-failed"
                    })];
            case 1:
                session = _a.sent();
                res.json({ url: session.url });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                return [2 /*return*/, res.send(err_1)];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
