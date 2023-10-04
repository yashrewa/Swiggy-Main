import axios from "axios";
import RestrauntCard from "./RestaurantCard";
import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { InitUser } from "../App";
import { backendLink } from "./utils/backendLink";
// import Theme from "./utils/Theme
// import DedicatedCart from "./DedicatedCart";

// function filterData(searchInput, restaurants) {
//     const filterData = restaurants.filter((restraunt) => restraunt.data.name.includes(searchInput));
//     return filterData;
// }




// function sortByPrice(restaurants) {

//     const sorted = restaurants.sort((a, b) => a.data.costForTwo / 100 - b.data.costForTwo / 100);
//     return sorted;
// }


const RestaurantList = () => {
    const [searchInput, setSearchInput] = useState("");
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);

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
            } if(sortType === "byPriceHighest"){
                console.log("byPriceHighest")
                return b[sortOptions] - a[sortOptions]
            } if(sortType === "byAvgRating"){
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

    },[]);

    const getRestaurants = async () => {
        try{
            console.log(localStorage.getItem('token'))
            if(localStorage.getItem('token' )!== null){
                const data = await axios.get(`${backendLink}/admin/restaurant-list`, {
                    headers: {
                        "Authorization": `Bearer ${
                            localStorage.getItem(`token`)
                        }`
                    }
                });
                const res = await data.data;
                console.log(res);
                setAllRestaurants(res);
                setFilteredRestaurants(res);
            }
        else{
            window.alert('Please Login')
            navigate('/')
        }

        }
        catch(err){
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
        
        <div className="flex-1">
            <InitUser />
            {/* <DedicatedCart/> */}
            <div className="lg:flex lg:flex-wrap w-full justify-center">
                <input type="text" className="border-2 lg:w-1/4 border-[#d3d5df] border-solid" placeholder="Search"
                    value={searchInput}
                    onChange={
                        (e) => setSearchInput(e.target.value)
                    }/>
                <button className="bg-green-500 rounded-sm p-1 lg:w-1/16 text-white lg:text-lg text-base"
                    // onClick={
                    //     () => {
                    //         const data = filterData(searchInput, allRestaurants);
                    //         console.log(data);
                    //         setFilteredRestaurants(data);
                    //     }}
                        >Search
                </button>
            </div>
            <div className="flex mt-4 justify-evenly">
                <button className="bg-green-500 rounded-md m-2 p-1 lg:rounded-xl lg:w-1/16 text-white lg:p-2 lg:text-base text-xs"
                    onClick={
                        () => {
                            const newArr = [...filteredRestaurants]
                            const dist = sortCommon(newArr, "byDeliveryTime", "deliveryTime");
                            console.log(dist);
                            setFilteredRestaurants(dist);
                        }
                }>
                    By Delivery time: Lowest
                </button>
                <button className="bg-green-500 rounded-md m-2 p-1 lg:rounded-xl lg:w-1/16 text-white lg:p-2 lg:text-base text-xs"
                    onClick={
                        () => {
                            const newArr2 = [...filteredRestaurants]
                            const price = sortCommon(newArr2, "byPriceLowest", "costForTwo");
                            console.log(filteredRestaurants)
                            setFilteredRestaurants(price);
                        }
                }>
                    By Price: Lowest
                </button>
                <button className="bg-green-500 rounded-md m-2 p-1 lg:rounded-xl lg:w-1/16 text-white lg:p-2 lg:text-base text-xs"
                    onClick={
                        () => {
                            const newArr2 = [...filteredRestaurants]
                            const price = sortCommon(newArr2, "byPriceHighest", "costForTwo");
                            setFilteredRestaurants(price);
                        }
                }>
                    By Price: Highest
                </button>
                <button className="bg-green-500 rounded-md m-2 p-1 lg:rounded-xl lg:w-1/16 text-white lg:p-2 lg:text-base text-xs"
                    onClick={
                        () => {
                            const newArr3 = [...filteredRestaurants]
                            const rating = sortCommon(newArr3, "byAvgRating", "avgRating");                            
                            setFilteredRestaurants(rating);
                        }
                }>
                    By Rating Highest
                </button>
            </div>
            <div className="flex flex-wrap justify-around p-4 font-Sans-serif">
                {
                filteredRestaurants || filteredRestaurants?.length>0 ?
                filteredRestaurants.map((restaurant) => {
                    return (
                        <div className="basis-auto lg:basis-1/4 p-6 px-8"
                            key={restaurant._id}>
                            <Link to={"restaurantmenu/"+restaurant._id}>
                                <RestrauntCard {...restaurant}/>
                            </Link>
                        </div>
                    );
                }): <> Loading...</>
            } </div>
        </div>
    );
};


export default RestaurantList
