"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantMenu = exports.Restaurant = exports.Admin = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const adminSchema = new mongoose_1.default.Schema({
    email: String,
    password: String,
});
const userSchema = new mongoose_1.default.Schema({
    email: String,
    password: String
});
const restaurantSchema = new mongoose_1.default.Schema({
    name: String,
    cloudinaryImageId: String,
    locality: String,
    area: String,
    costForTwo: Number,
    avgRating: mongoose_1.default.Types.Decimal128,
    totalRating: Number,
    veg: Boolean,
    deliveryTime: Number,
    menu: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'RestaurantMenu'
        }]
});
const restaurantMenuSchema = new mongoose_1.default.Schema({
    name: String,
    description: String,
    imageId: String,
    price: Number,
    veg: Boolean
});
// const restaurantMenuSchema = new mongoose.Schema({
//     res_id: Object,
//     info: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Restaurant'
//     }],
//     menu: {
//         name: String,
//         description: String,
//         imageId: String,
//         price: Number
//     }
// })
exports.User = mongoose_1.default.model('User', userSchema);
exports.Admin = mongoose_1.default.model('Admin', adminSchema);
exports.Restaurant = mongoose_1.default.model('Restaurant', restaurantSchema);
exports.RestaurantMenu = mongoose_1.default.model('RestaurantMenu', restaurantMenuSchema);
