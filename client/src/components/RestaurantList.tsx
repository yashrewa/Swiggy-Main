import axios from "axios";
import RestrauntCard from "./RestaurantCard";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { InitUser } from "../App";
import { backendLink } from "./utils/backendLink";
// import Theme from "./utils/Theme
// import DedicatedCart from "./DedicatedCart";

function filterData(searchInput, restaurants) {
    const filterData = restaurants.filter((restraunt) => restraunt.name.includes(searchInput));
    return filterData;
}




// function sortByPrice(restaurants) {

//     const sorted = restaurants.sort((a, b) => a.data.costForTwo / 100 - b.data.costForTwo / 100);
//     return sorted;
// }


const RestaurantList = () => {
    const [searchInput, setSearchInput] = useState("");
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [dropDown, setDropDown] = useState(false);

    const navigate = useNavigate();

    function sortCommon(restaurants, sortType, sortOptions) {
        console.log(restaurants)
        const sorted = restaurants.sort((a, b) => {
            if (sortType === "byDeliveryTime") {
                console.log("deliveryTime")
                return a[sortOptions] - b[sortOptions]
            } if (sortType === "byPriceLowest") {
                console.log("byPriceLowest")
                return a[sortOptions] - b[sortOptions]
            } if (sortType === "byPriceHighest") {
                console.log("byPriceHighest")
                return b[sortOptions] - a[sortOptions]
            } if (sortType === "byAvgRating") {
                console.log("byAvgRating");
                console.log(b[sortOptions].$numberDecimal)
                return b[sortOptions].$numberDecimal - a[sortOptions].$numberDecimal
            }
            console.log("failed");

        });
        return sorted;
    }

    useEffect(() => {
        getRestaurants();
        console.log(filteredRestaurants);

    }, []);

    const getRestaurants = async () => {
        try {
            console.log(localStorage.getItem('token'))
            if (localStorage.getItem('token') !== null) {
                const data = await axios.get(`${backendLink}/admin/restaurant-list`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem(`token`)
                            }`
                    }
                });
                const res = await data.data;
                console.log(res);
                setAllRestaurants(res);
                setFilteredRestaurants(res);
            }
            else {
                window.alert('Please Login')
                navigate('/')
            }

        }
        catch (err) {
            console.log(err);
        }
    };


    // if (! useStatus) {
    //     return <div>Look's Link You're Offline</div>;
    // }
    // console.log(filteredRestaurants)

    return allRestaurants?.length === 0 ? (
        <div>Loading...</div>
    ) : (

        <div className="flex-1 mt-8 h-auto">
            <InitUser />
            <div className="relative mx-4 bg-[#d4d4d4] btn-neomorph lg:mx-48">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <input type="search" id="default-search" value={searchInput} className="block w-full h-14 p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none " placeholder="Search" required
                    onChange={(e) => { 
                        setSearchInput(e.target.value) 
                        const data = filterData(searchInput, allRestaurants);
                        setFilteredRestaurants(data);
                    }} 
                    onKeyDown={(e) => e.key === 'Enter' ? setFilteredRestaurants(filterData(searchInput, allRestaurants)) : null}
                />
                <button className="text-whiten btn-neomorph absolute right-2.5 bottom-2.5 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                    onClick={
                        () => {
                            const data = filterData(searchInput, allRestaurants);
                            setFilteredRestaurants(data);
                        }}>Search</button>
            </div>

            <div className="flex justify-end mx-4 lg:mx-48 relative">
                <button id="dropdownDefaultButton" onClick={() => setDropDown(!dropDown)} className="text-black btn-neomorph my-4 outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center " type="button">Sort <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                </svg>
                </button>
                {dropDown && (
                    <div id="dropdown" className="z-10 fixed top-[220px] lg:left-[1535px] bg-white divide-y backdrop-blur-md divide-gray-100 rounded-lg shadow w-44 ">
                        <ul className="py-2 text-sm text-gray-700 " aria-labelledby="dropdownDefaultButton">
                            <li onClick={
                                () => {
                                    const newArr = [...filteredRestaurants]
                                    const dist = sortCommon(newArr, "byDeliveryTime", "deliveryTime");

                                    setDropDown(false)
                                    setFilteredRestaurants(dist);
                                }
                            }>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100  ">Delivery Time: Lowest</a>
                            </li>
                            <li onClick={
                                () => {
                                    const newArr2 = [...filteredRestaurants]
                                    const price = sortCommon(newArr2, "byPriceLowest", "costForTwo");

                                    setDropDown(false)
                                    setFilteredRestaurants(price);
                                }
                            }>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100  ">Price: Lowest</a>
                            </li>
                            <li onClick={
                                () => {
                                    const newArr2 = [...filteredRestaurants]
                                    const price = sortCommon(newArr2, "byPriceHighest", "costForTwo");
                                    setDropDown(false)
                                    setFilteredRestaurants(price);
                                }
                            }>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100  ">Price: Highest</a>
                            </li>
                            <li onClick={
                                () => {
                                    const newArr3 = [...filteredRestaurants]
                                    const rating = sortCommon(newArr3, "byAvgRating", "avgRating");
                                    setDropDown(false)
                                    setFilteredRestaurants(rating);
                                }
                            }>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100  ">Rating Highest</a>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <div className="flex flex-auto flex-wrap justify-around p-4 h-full font-Sans-serif mx-4 md:mx-28 lg:mx-36">
                {
                    filteredRestaurants || filteredRestaurants?.length > 0 ?
                        filteredRestaurants.map((restaurant) => {
                            return (
                                <div className="basis-auto h-full lg:basis-1/4 p-6 px-8"
                                    key={restaurant._id}>
                                    <Link to={"restaurantmenu/" + restaurant._id} className="h-[300px]">
                                        <RestrauntCard {...restaurant} />
                                    </Link>
                                </div>
                            );
                        }) : <> Loading...</>
                } </div>
        </div>
    );
};


export default RestaurantList
