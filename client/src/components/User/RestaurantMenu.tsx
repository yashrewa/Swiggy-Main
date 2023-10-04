import {useParams} from "react-router-dom";
import useRestaurant from "../utils/useRestaurant";
import { Params } from "react-router-dom";
import {useRecoilState} from "recoil";
import {cartState} from "../store/atoms/cart";


interface Items{
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
  

function UserRestaurantMenu() { // const navigate = useNavigate();
    const [cart, setCart] = useRecoilState(cartState)



    const resId: CustomParams = useParams() as CustomParams;

    const restaurant:Restaurant = useRestaurant(resId) 


    const handleAddToCart = async (cusineId : string) => {
        const item = restaurant.menu.find(item => item._id === cusineId)
        const isPresent = cart.findIndex(item => item._id === cusineId);
        console.log(cart)
        if (isPresent === -1) {
            console.log("if control");
            setCart(prevState => [
                ...prevState, {
                    ... item,
                    quantity: 1
                }
            ])
        } else {
            console.log("else control");
            setCart(prevState => {
                return prevState.map(prevItem => {
                    return prevItem._id === cusineId ? {
                        ...prevItem,
                        quantity: prevItem.quantity + 1
                    } : prevItem
                })
            })

        }
    }

    return ! restaurant ? (<>loading...</>) : (<div className="grid">
        <div className="bg-black text-white flex justify-center lg:justify-start pt-4 lg:pt-8 pb-8 lg:pb-0 shadow-lg shadow-slate-500 font-ProximaNova">
            <div className="p-1.5 lg:pt-8 pb-8 lg:px-14">
                <div>
                    <img className="h-24 lg:h-40 w-auto hidden lg:block lg:w-64 lg:ml-24 lg:my-4 rounded-md"
                        src={
                            restaurant.cloudinaryImageId
                        }/>
                </div>
            </div>
            <div className="w-auto">
                <div className="max-w-lg font-light  lg:pt-12 text-4xl"> {
                    restaurant.name
                } </div>
                <div className="text-sm font-medium mt-3 text-neutral-300">
                    <div className="pt-2"> {
                        restaurant.locality + ", " + restaurant.area
                    } </div>
                    <div className="pt-2"> {
                        restaurant.locality
                    } </div>
                    <div className="flex justify-between pt-4 font-semibold text-base">
                        <div className="text-white font-medium pr-8 border-neutral-600 border-r-2">
                            ★ {
                            restaurant ?. avgRating ?. $numberDecimal
                        }
                            <div className="text-xs mt-1 text-neutral-300 font-normal"> {
                                restaurant.totalRating
                            }k+ Ratings
                            </div>
                        </div>
                        <div className="px-8 border-neutral-600 border-r-2">
                            <div className="text-white font-medium"> {
                                restaurant.deliveryTime
                            }
                                mins
                            </div>
                            <div className="text-xs mt-1 text-neutral-300 font-normal">
                                Delivery Time
                            </div>
                        </div>
                        <div className="px-8 border-neutral-600 border-r-2">
                            <div className="text-white font-medium"> {
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
        {/* <div>
                <button className="bg-green-500 my-4 p-1 px-2 rounded-md text-white border-2 border-neutral-300"
                    onClick={
                        () => {
                            setShow(true);


                        }
                }>Add New Cuisine</button>
            </div> */}
        <div className="flex justify-center w-full"> {/* <button
                  className={` $ {
                selectedCategory === "All" ? "bg-green-500" : "bg-neutral-200"
            }
            text - white text - sm font - medium mr - 4 py - 1 px - 3 rounded - md `}
                  // onClick={() => setSelectedCategory("All")}
                >
                  All
                </button> */}
            <div> {
                restaurant ?. menu ?. map((items) => {
                    return (<div className="pt-8 w-screen"
                        key={
                            items?._id
                    }>
                        <div className="flex border-b-2 border-neutral-300 justify-between mt-4 px-6 lg:px-0 pb-4 w-screen lg:w-6/12 lg:mx-80">
                            <div>
                                <div className="w-10/12 pb-4 lg:w-auto text-left">
                                    <div className="text-lg"> {
                                        items.name
                                    } </div>
                                    <div className="text-base text-neutral-700">
                                        ₹ {
                                        items.price
                                    } </div>
                                    
                                </div>
                                <div className="pt-1 w-3/5 text-left tracking-tight text-neutral-400"> {
                                    items.description
                                } </div>
                            </div>
                            <div className="flex-row justify-center"> {
                                !items.imageId ? (<div className="w-40 h-auto"></div>) : (<img className="w-40 h-auto border rounded-md"
                                    src={items ?. imageId}/>)
                            }
                                <button className="bg-green-500 mx-4 p-0.5 rounded-md text-white border-2 border-neutral-300"
                                    onClick={
                                        () => {
                                            handleAddToCart(items._id)
                                            // window.location.reload()
                                        }
                                }>
                                    Add To Cart
                                </button>
                            </div>
                        </div>
                    </div>);
                })
            } </div>
        </div>
    </div>);
}

export default UserRestaurantMenu;
