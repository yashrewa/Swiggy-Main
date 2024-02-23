import mongoose from 'mongoose'


const adminSchema = new mongoose.Schema({
    email: String,
    password: String,
})

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const restaurantSchema = new mongoose.Schema({
    name: String,
    cloudinaryImageId: String,
    locality: String,
    area: String,
    costForTwo: Number,
    avgRating: mongoose.Types.Decimal128,
    totalRating: Number,
    veg: Boolean,
    deliveryTime: Number,
    menu: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RestaurantMenu'
    }]
})

const restaurantMenuSchema = new mongoose.Schema({
        name: String,
        description: String,
        imageId: String,
        price: Number,
        veg: Boolean
})
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


export const User = mongoose.model('User', userSchema);
export const Admin = mongoose.model('Admin', adminSchema);
export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export const RestaurantMenu = mongoose.model('RestaurantMenu', restaurantMenuSchema);