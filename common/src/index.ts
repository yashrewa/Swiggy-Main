import {z} from 'zod'

export const signupValidate = z.object({email: z.string().email().min(1), password: z.string().min(8)})
export const loginValidate = z.object({email: z.string().min(1), password: z.string().min(8)})
export const restaurantValidate = z.object({
    name: z.string().min(1),
    cloudinaryImageId: z.string().min(1),
    locality: z.string().min(1),
    costForTwo: z.number().min(1),
    avgRating: z.number().min(1),
    isVeg: z.boolean(),
    deliveryTime: z.number().min(1)
})


export type SingupType = z.infer<typeof signupValidate>
export type LoginType = z.infer<typeof loginValidate>
export type RestaurantType = z.infer<typeof restaurantValidate>