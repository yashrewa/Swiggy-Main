import {AiFillCloseSquare} from 'react-icons/ai'
import {cartItems} from '../store/selectors/cartData';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {cartState} from '../store/atoms/cart';
import axios from 'axios';
import { backendLink } from '../utils/backendLink';

function Cart({visible, onClose}) {
    const items = useRecoilValue(cartItems)

    const setCartItems = useSetRecoilState(cartState)

    function totalPrice() {
        let total = 0;
        items.forEach(item => {
            total += item.price * item.quantity
        })
        return total
    }

    const handleCheckout =async()=>{
        try{
            const response = await axios.post(`${backendLink}/user/create-checkout-session`,{
                items: items
            },{headers: {
                "Authorization" : `Bearer ${localStorage.getItem("token")}`
            }})
            console.log(response.data);
            window.location.href = response.data.url;
            
        }
        catch(e){
            console.log(e)
        }
    }

    function handleIncrease(id : string) {
        setCartItems(prevState => {
            return prevState.map(prevItem=>{
                return prevItem._id === id ? {...prevItem, quantity: prevItem.quantity+1}: prevItem
            })
        })
    }
    function handleDecrease(id : string) {
        const itemIncrease = items.find(item=> item._id === id)
        if(itemIncrease.quantity>1){
            setCartItems(prevState => {
                return prevState.map(prevItem=>{
                    return prevItem._id === id ? {...prevItem, quantity: prevItem.quantity-1}: prevItem
                })
            })

        }
        else{
            setCartItems(prevState=>{
                return prevState.filter(prevItem=> prevItem._id !== id)
            })
        }
    }

    // console.log(totalPrice())


    if (!visible) 
        return null;
    

    return (<>
        <div className="fixed inset-0 z-20 overflow-y-scroll bg-black bg-opacity-80 justify-center items-center">
            <div className="bg-gray-100 m-4 lg:translate-x-0 lg:h-5/6 lg:m-12 lg:mx-32 lg:p-10">
                <div className="container  lg:mx-auto lg:px-4">
                    <div className="flex justify-between">
                        <div className="text-2xl font-Inter  font-semibold mb-4">Shopping Cart</div>
                        <div className='hover:cursor-pointer'
                            onClick={onClose}>
                            <AiFillCloseSquare className="btn-neomorph text-gray-950 text-2xl"/>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-3/4">
                            <div className="bg-white overflow-y-hidden rounded-lg shadow-md p-4 lg:p-6 mb-4">
                                <table className=" w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-left font-semibold">Product</th>
                                            <th className="text-left font-semibold">Price</th>
                                            <th className="text-left font-semibold">Quantity</th>
                                            <th className="text-left font-semibold">Total</th>
                                        </tr>
                                    </thead>
                                    {
                                    items ? items.map(item => (<tbody key={
                                        item._id
                                    }>
                                        <tr className='overflow-y-hidden'>
                                            <td className="py-4">
                                                <div className="flex items-center text-left">
                                                    <img className="h-16 block lg:block w-16 mr-4"
                                                        src={
                                                            item.imageId
                                                        }
                                                        alt="Product image"/>
                                                    <span className="lg:font-semibold"> {
                                                        item.name
                                                    }</span>
                                                </div>
                                            </td>
                                            <td className="py-4"> {
                                                item.price
                                            }</td>
                                            <td className=" lg:py-4">
                                                <div className="flex items-center">
                                                    <button className="border rounded-md py-2 px2 lg:px-4 mr-2" onClick={
                                                            () => handleDecrease(item._id)
                                                    }>-</button>
                                                    <span className="text-center w-2 lg:w-8"> {
                                                        item.quantity
                                                    }</span>
                                                    <button className="border rounded-md py-2 px2 lg:px-4 ml-2"
                                                        onClick={
                                                            () => handleIncrease(item._id)
                                                    }>+</button>
                                                </div>
                                            </td>
                                            <td className="py-4"> {
                                                item.quantity * item.price
                                            }</td>
                                        </tr>
                                    </tbody>)) : null
                                }

                                    {/* <!-- More product rows --> */} </table>
                            </div>
                        </div>
                        <div className="md:w-1/4">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-lg font-semibold mb-4">Summary</h2>
                                <div className="flex justify-between mb-2">
                                    <span>Subtotal</span>
                                    <span>Rs. {
                                        totalPrice()
                                    }</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Taxes</span>
                                    <span>Rs. {
                                        (totalPrice() * .05).toFixed(2)
                                    }</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Shipping</span>
                                    <span>Rs. 0.00</span>
                                </div>
                                <hr className="my-2"/>
                                <div className="flex justify-between mb-2">
                                    <span className="font-semibold">Total</span>
                                    <span className="font-semibold">Rs. {
                                        totalPrice() + (+ ((totalPrice() * .05).toFixed(2)))
                                    }</span>
                                </div>
                                <button className="btn-neomorph text-black hover:bg-gray-200 transition-all ease-in-out py-2 px-4 rounded-lg mt-4 w-full" onClick={()=>handleCheckout()}>Checkout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default Cart;
