import { useParams } from "react-router-dom";
import useRestaurant from "../utils/useRestaurant";
import axios from "axios";
import { useState } from "react";
import AddCusine from "./AddCusines";
import { backendLink } from "../utils/backendLink";
import { Params } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// interface Menu[{
//     description: string;

// }]
interface Items {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageId: string;
    quantity: number;
}


interface Restaurant {
    _id: number;
    name: string;
    menu: Items[]
    locality: string;
    area: string;
    deliveryTime: number;
    veg: boolean;
    avgRating: {
        $numberDecimal: string;
    };
    costForTwo: number;
    totalRating: number;
    cloudinaryImageId: string;
}

interface CustomParams extends Params {
    resId: string;
}

function RestaurantMenu() {
    const [show, setShow] = useState(false)
    const navigate = useNavigate()

    const resId: CustomParams = useParams() as CustomParams;
    console.log(resId)

    const restaurant: Restaurant | undefined = useRestaurant(resId)

    const handleOnClose = () => {
        setShow(false)
    }

    const handleDeleteItem = async (cusineId, id) => {
        console.log(cusineId, id.resId)
        const res = await axios.post(`${backendLink}/admin/restaurant-delete/` + id.resId, {
            cusineId
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')
                    }`
            }
        })
        console.log(res)
    }

    return !restaurant ? (
        <>loading...</>
    ) : (
        <div className="grid">
            <div className="bg-black text-white flex justify-start shadow-lg shadow-slate-500 font-ProximaNova">
                <div className="pt-8 pb-8 px-14">
                    <div>
                        <img className="h-40 w-64 ml-24 my-4 rounded-md"
                            src={
                                restaurant.cloudinaryImageId
                            } />
                    </div>
                </div>
                <div className="w-auto">
                    <div className="max-w-lg font-light pt-12 text-4xl">
                        {
                            restaurant.name
                        } </div>
                    <div className="text-sm font-medium mt-3 text-neutral-300">
                        <div className="pt-2">
                            {
                                restaurant.locality + ", " + restaurant.area
                            } </div>
                        <div className="pt-2">
                            {
                                restaurant.locality
                            } </div>
                        <div className="flex justify-between pt-4 font-semibold text-base">
                            <div className="text-white font-medium pr-8 border-neutral-600 border-r-2">
                                ★ {
                                    restaurant?.avgRating?.$numberDecimal
                                }
                                <div className="text-xs mt-1 text-neutral-300 font-normal">
                                    {
                                        restaurant.totalRating
                                    }k+ Ratings
                                </div>
                            </div>
                            <div className="px-8 border-neutral-600 border-r-2">
                                <div className="text-white font-medium">
                                    {
                                        restaurant.deliveryTime
                                    }
                                    mins
                                </div>
                                <div className="text-xs mt-1 text-neutral-300 font-normal">
                                    Delivery Time
                                </div>
                            </div>
                            <div className="px-8 border-neutral-600 border-r-2">
                                <div className="text-white font-medium">
                                    {
                                        restaurant.costForTwo
                                    } </div>
                                <div className="text-xs mt-1 text-neutral-300 font-normal">
                                    Cost for two
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <button className="btn-neomorph my-4 p-1 px-2 text-black border-2 border-neutral-300"
                    onClick={
                        () => {
                            setShow(true);


                        }
                    }>Add New Cuisine</button>
            </div>
            <div className="flex justify-center w-full">
                {/* <button
                  className={` $ {
                selectedCategory === "All" ? "bg-green-500" : "bg-neutral-200"
            }
            text - white text - sm font - medium mr - 4 py - 1 px - 3 rounded - md `}
                  // onClick={() => setSelectedCategory("All")}
                >
                  All
                </button> */}
                <div> {
                    restaurant?.menu?.map((items) => {
                        return (
                            <div className="pt-8 w-screen"
                                key={
                                    items?._id
                                }>
                                <div className="flex border-b-2 border-neutral-300 justify-between mt-4 pb-4 w-6/12 mx-80">
                                    <div>
                                        <div className="item-name-price">
                                            <div className="text-lg">
                                                {
                                                    items.name
                                                } </div>
                                            <div className="text-base text-neutral-700">
                                                ₹ {
                                                    items.price / 100
                                                } </div>

                                            <br />
                                        </div>
                                        <div className="pt-1 w-3/5 tracking-tight text-neutral-400">
                                            {
                                                items.description
                                            } </div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        {
                                            !items.imageId ? (
                                                <div className="w-40 h-auto"></div>
                                            ) : (
                                                <img className="w-40 h-auto z-0 border rounded-md"
                                                    src={
                                                        items?.imageId
                                                    } />
                                            )
                                        }
                                        <button className="bg-green-500 mx-4 p-0.5 rounded-md absolute -bottom-4 text-white border-2 border-neutral-300"
                                            onClick={
                                                () => {
                                                    handleDeleteItem(items._id, resId)
                                                    navigate('/admin/restaurant-list')
                                                }
                                            }>
                                            Delete Cuisine
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                } </div>
            </div>
            <div className="w-4/6 mr-6 h-screen sticky top-0">
                <AddCusine resId={resId}
                    visible={show}
                    onClose={handleOnClose} />
            </div>
        </div>
    );
}

export default RestaurantMenu;
