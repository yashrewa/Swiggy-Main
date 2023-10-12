import axios from "axios";
import {useState} from "react";
import { backendLink } from "../utils/backendLink";

function AddRestaurant() {

    const initialState = {
        name: "",
        cloudinaryImageId: "",
        locality: "",
        area: "",
        costForTwo: 0,
        avgRating: 0,
        isVeg: false,
        deliveryTime: 0
    };
    const [restaurantData, setRestaurantData] = useState(initialState);


    const handleChange = (e) => {
        if (e.target.checked) {
            console.log(e.target.checked)
            console.log("set to veg");
            setRestaurantData({
                ...restaurantData,
                isVeg: true
            })
            return;
        } else {
            console.log("set to non veg");
            setRestaurantData({
                ...restaurantData,
                isVeg: false
            })
        }
    }

    const handleAddRestaurant = async () => {
        const res = await axios.post(`${backendLink}/admin/add-restaurant`, {
            ...restaurantData
        }, {
            headers: {
                Authorization: `Bearer ${
                    localStorage.getItem("token")
                }`
            }
        })
        console.log(res)
    }
    return (<> {
        console.log(restaurantData)
    }
        <div className="my-16 flex justify-center">
            <div className="w-1/4 border-2 p-6 border-gray-200 card-neomorph text-center">
                <div className="mb-3 pt-0">
                    <input type="text" placeholder="Name" className="px-3 py-3 placeholder-slate-500 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                        onChange={
                            (e) => setRestaurantData({
                                ...restaurantData,
                                name: e.target.value
                            })
                        }/>
                </div>
                <div className="mb-3 pt-0">
                    <input type="text" placeholder="cloudinaryImageId Link" className="px-3 py-3 placeholder-slate-500 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                        onChange={
                            (e) => setRestaurantData({
                                ...restaurantData,
                                cloudinaryImageId: e.target.value
                            })
                        }/>
                </div>
                <div className="mb-3 pt-0">
                    <input type="text" placeholder="locality" className="px-3 py-3 placeholder-slate-500 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                        onChange={
                            (e) => setRestaurantData({
                                ...restaurantData,
                                locality: e.target.value
                            })
                        }/>
                </div>
                <div className="mb-3 pt-0">
                    <input type="text" placeholder="area" className="px-3 py-3 placeholder-slate-500 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                        onChange={
                            (e) => setRestaurantData({
                                ...restaurantData,
                                area: e.target.value
                            })
                        }/>
                </div>
                <div className="mb-3 pt-0">
                    <input type="number" placeholder="costForTwo" className="px-3 py-3 placeholder-slate-500 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                        onChange={
                            (e) => setRestaurantData({
                                ...restaurantData,
                                costForTwo: + e.target.value
                            })
                        }/>
                </div>
                <div className="mb-3 pt-0">
                    <input type="number" placeholder="avgRating" className="px-3 py-3 placeholder-slate-500 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                        onChange={
                            (e) => setRestaurantData({
                                ...restaurantData,
                                avgRating: + e.target.value
                            })
                        }/>
                </div>
                <div className="mb-3 pt-0">
                    <input type="number" placeholder="deliveryTime" className="px-3 py-3 placeholder-slate-500 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                        onChange={
                            (e) => setRestaurantData({
                                ...restaurantData,
                                deliveryTime: + e.target.value
                            })
                        }/>
                </div>
                <div className="flex items-center my-4">
                    <input id="default-checkbox" type="checkbox"
                        value={
                            restaurantData.isVeg.toString()
                        }
                        onChange={
                            e => handleChange(e)
                        }
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                    <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-slate-500">isVeg</label>
                </div>

                <button type="button" className="focus:outline-none text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-purple-900"
                    onClick={
                        () => handleAddRestaurant()
                }>
                    Add Restaurant
                </button>
            </div>
        </div>
    </>);
}

export default AddRestaurant
