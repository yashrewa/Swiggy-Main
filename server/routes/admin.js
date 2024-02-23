"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var mongoose_1 = require("mongoose");
var zod_1 = require("zod");
var Auth_1 = require("../middleware/Auth");
var router = express_1.default.Router();
// ZOD Validation below
var signupValidate = zod_1.z.object({ email: zod_1.z.string().min(1), password: zod_1.z.string().min(8) });
var loginValidate = zod_1.z.object({ email: zod_1.z.string().min(1), password: zod_1.z.string().min(8) });
var restaurantValidate = zod_1.z.object({
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
router.post('/signup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parsedInput, _a, email, password, existingAdmin, newAdmin, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                parsedInput = signupValidate.safeParse(req.body);
                _a = req.body, email = _a.email, password = _a.password;
                if (!parsedInput.success) {
                    return [2 /*return*/, res.json({ message: parsedInput.error })];
                }
                console.log(email, password);
                return [4 /*yield*/, db_1.Admin.findOne({ email: email })];
            case 1:
                existingAdmin = _b.sent();
                if (!existingAdmin) return [3 /*break*/, 2];
                return [2 /*return*/, res.json({ message: 'email already registered!' })];
            case 2:
                newAdmin = new db_1.Admin({ email: email, password: password });
                return [4 /*yield*/, newAdmin.save()];
            case 3:
                _b.sent();
                token = jsonwebtoken_1.default.sign({
                    email: email,
                    role: 'admin'
                }, Auth_1.secretKey, { expiresIn: '1h' });
                res.json({ message: "New Admin", token: token });
                _b.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parsedInput, _a, email, password, user, token, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                parsedInput = loginValidate.safeParse(req.headers);
                if (!parsedInput.success) {
                    return [2 /*return*/, res.json({ message: parsedInput.error })];
                }
                _a = req.headers, email = _a.email, password = _a.password;
                console.log(req.headers);
                return [4 /*yield*/, db_1.Admin.findOne({ email: req.headers.email, password: req.headers.password })];
            case 1:
                user = _b.sent();
                console.log(user);
                if (user && email) {
                    token = jsonwebtoken_1.default.sign({
                        email: email,
                        role: "admin"
                    }, Auth_1.secretKey, { expiresIn: '1h' });
                    res.json({ message: "Logged in successfully", token: token });
                }
                else {
                    res.json({ message: "User Authentication Failed" });
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.log(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/restaurant-list', Auth_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var restaurantList, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log(req.headers.email);
                return [4 /*yield*/, db_1.Restaurant.find({})];
            case 1:
                restaurantList = _a.sent();
                if (!restaurantList) {
                    return [2 /*return*/, res.status(404).json({ message: "Empty" })];
                }
                return [2 /*return*/, res.json(restaurantList)];
            case 2:
                error_2 = _a.sent();
                res.json(error_2);
                console.log(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/add-restaurant', Auth_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resData_1, parsedInput, retrievedRestaurantList, isPresent, newRestaurant, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                resData_1 = __assign({}, req.body);
                parsedInput = restaurantValidate.safeParse(req.body);
                console.log(req.body);
                console.log(parsedInput.success);
                if (!parsedInput.success) {
                    return [2 /*return*/, res.status(404).json({ message: parsedInput.error })];
                }
                return [4 /*yield*/, db_1.Restaurant.find({})];
            case 1:
                retrievedRestaurantList = _a.sent();
                isPresent = retrievedRestaurantList.find(function (restaurant) { return restaurant.name === resData_1.name; });
                if (!(resData_1 && parsedInput.success && !isPresent)) return [3 /*break*/, 3];
                newRestaurant = new db_1.Restaurant(__assign({}, resData_1));
                return [4 /*yield*/, newRestaurant.save()];
            case 2:
                _a.sent();
                res.json({ message: 'Restaurant added successfully' });
                return [3 /*break*/, 4];
            case 3:
                res.status(404).json({ message: 'Unable to add restaurant' });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_3 = _a.sent();
                res.json(error_3);
                console.log(error_3);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/add-food/:resId', Auth_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resId, courseIdObjectId, resData, newItem, restaurant, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                resId = req.params.resId;
                courseIdObjectId = new mongoose_1.default.Types.ObjectId(resId);
                resData = __assign({}, req.body);
                console.log(resData);
                newItem = new db_1.RestaurantMenu(resData);
                return [4 /*yield*/, newItem.save()];
            case 1:
                _a.sent();
                return [4 /*yield*/, db_1.Restaurant.findById(courseIdObjectId)];
            case 2:
                restaurant = _a.sent();
                if (!restaurant) return [3 /*break*/, 4];
                restaurant.menu.push(newItem._id);
                return [4 /*yield*/, restaurant.save()];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                res.json({ restaurant: restaurant, newItem: newItem });
                return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                res.status(404).json({ message: err_1 });
                console.log(err_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
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
router.get('/restaurant-details/:id', Auth_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, restaurantInfo, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                if (!id) return [3 /*break*/, 2];
                return [4 /*yield*/, db_1.Restaurant.findById(id).populate('menu')];
            case 1:
                restaurantInfo = _a.sent();
                console.log(restaurantInfo);
                if (!restaurantInfo) {
                    res.status(401).json({ message: "No food related this restaurant available" });
                }
                res.json({ message: "these are all restaurants speciality", restaurantInfo: restaurantInfo });
                _a.label = 2;
            case 2: return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                res.json({ message: error_4 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
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
router.post('/restaurant-delete/:id', Auth_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resId, cusineId_1, restaurant, cusine, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                resId = req.params.id;
                console.log(resId);
                cusineId_1 = req.body.cusineId;
                console.log(cusineId_1);
                return [4 /*yield*/, db_1.Restaurant.findById(resId)];
            case 1:
                restaurant = _a.sent();
                if (!restaurant) return [3 /*break*/, 4];
                restaurant.menu = restaurant.menu.filter(function (item) { return item.toString() !== cusineId_1; });
                return [4 /*yield*/, restaurant.save()];
            case 2:
                _a.sent();
                return [4 /*yield*/, db_1.RestaurantMenu.findByIdAndDelete(req.body.cusineId)];
            case 3:
                cusine = _a.sent();
                res.json({ restaurant: restaurant, cusine: cusine });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_2 = _a.sent();
                res.json({ message: err_2 });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
