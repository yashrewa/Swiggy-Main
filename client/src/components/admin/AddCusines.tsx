import axios from "axios";
import {useState} from "react";
import {AiFillCloseSquare} from 'react-icons/ai'
// import { useNavigate } from "react-router-dom";
import { backendLink } from "../utils/backendLink";


function AddCusine({resId, visible, onClose}) {
    //use resId.resId instead of resId

    // const navigate = useNavigate();
    const initialState = {
        name: "",
        description: "",
        imageId: "",
        price: 0,
        isVeg: false
    };
    const [restaurantMenuData, setRestaurantMenuData] = useState(initialState);


    const handleChange = (e) => {
        if (e.target.checked) {
            console.log(e.target.checked)
            console.log("set to veg");
            setRestaurantMenuData({
                ...restaurantMenuData,
                isVeg: true
            })
            return;
        } else {
            console.log("set to non veg");
            setRestaurantMenuData({
                ...restaurantMenuData,
                isVeg: false
            })
        }
    }

    const handleAddCusine = async (id) => {
        const res = await axios.post(`${backendLink}/admin/add-food/` + id, {
            ...restaurantMenuData
        }, {
            headers: {
                Authorization: `Bearer ${
                    localStorage.getItem("token")
                }`
            }
        })
        console.log(res)
    }
    if (!visible) 
        return null
    
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm justify-center items-center">
                <div className=" my-16 flex  justify-center">
                    <div className="w-1/4 bg-white border-2 p-6 border-gray-400 rounded-xl text-center">
                        <div className="flex justify-end">
                            <button onClick={onClose}>
                                <AiFillCloseSquare className="fill-green-500 text-2xl"/>
                            </button>
                        </div>
                        <div className="mb-3 pt-0">
                            <input type="text" placeholder="name" className="px-3 py-3 placeholder-slate-500 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                                onChange={
                                    (e) => setRestaurantMenuData({
                                        ...restaurantMenuData,
                                        name: e.target.value
                                    })
                                }/>
                        </div>
                        <div className="mb-3 pt-0">
                            <input type="text" placeholder="description" className="px-3 py-3 placeholder-slate-500 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                                onChange={
                                    (e) => setRestaurantMenuData({
                                        ...restaurantMenuData,
                                        description: e.target.value
                                    })
                                }/>
                        </div>
                        <div className="mb-3 pt-0">
                            <input type="text" placeholder="imageId" className="px-3 py-3 placeholder-slate-500 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                                onChange={
                                    (e) => setRestaurantMenuData({
                                        ...restaurantMenuData,
                                        imageId: e.target.value
                                    })
                                }/>
                        </div>
                        <div className="mb-3 pt-0">
                            <input type="number" placeholder="price" className="px-3 py-3 placeholder-slate-500 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                                onChange={
                                    (e) => setRestaurantMenuData({
                                        ...restaurantMenuData,
                                        price: + e.target.value
                                    })
                                }/>
                        </div>
                        <div className="flex items-center my-4">
                            <input id="default-checkbox" type="checkbox"
                                value={
                                    restaurantMenuData.isVeg.toString()
                                }
                                onChange={
                                    e => handleChange(e)
                                }
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-slate-500">isVeg</label>
                        </div>

                        <button type="button" className="focus:outline-none text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-900"
                            onClick={
                                () => {
                                    handleAddCusine(resId.resId)
                                    window.location.reload()
                                    onClose()
                                }
                        }>
                            Add Cusine
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddCusine;
