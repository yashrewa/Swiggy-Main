import Logo from "./constants/Logo";
import {Link} from "react-router-dom";
import {userState} from "./store/atoms/user";
import {useState} from "react";
import {useRecoilValue, useSetRecoilState, useRecoilState} from "recoil";
import {useNavigate} from "react-router-dom";
import {FaAlignRight, FaCartShopping} from "react-icons/fa6"
import Cart from "./User/Cart";
import {cartItems} from "./store/selectors/cartData";
import {showState} from "./store/atoms/show";


const Navbar = () => {
    const email = useRecoilValue(userState)
    const setEmail = useSetRecoilState(userState)
    const cartItemsInfo = useRecoilValue(cartItems)
    const [navbarOpen, setNavbarOpen] = useState(false)
    const [show, setShow] = useRecoilState(showState)

    const handleOnClose = () => {
        setShow(false)
    }
    console.log(cartItemsInfo.length)


    // const cartItems = useSelector(store => store.cart.items)
    const navigate = useNavigate();
    console.log(email.email)

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
        setEmail({email: null})
    }
    return (<>
        <nav className="relative shadow-lg  flex flex-wrap items-center justify-between px-2 py-1 mb-3">
            <div className="md:container w-full md:mx-auto px-4 flex flex-wrap items-center justify-between">
                <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
                    <a className="text-lg font-bold leading-relaxed inline-block mr-4  whitespace-nowrap uppercase text-black" href="/"> {
                        email.email ? <Link to="/restaurant-list"><Logo/>
                        </Link> : <Link to="/"><Logo/></Link>
                    } </a>
                    <div className="flex">
                        {email.email?<button className="text-green-500 cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none" type="button" onClick={()=>setShow(true)}>
                        <div className="flex"><FaCartShopping /><span className="-translate-y-3" >{cartItemsInfo.length===0? null : cartItemsInfo.length}</span></div>
                        </button>:null}
                        
                        <button className="text-green-500 cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none" type="button"
                            onClick={
                                () => setNavbarOpen(!navbarOpen)
                        }>
                            <FaAlignRight className="text-green-500"/>
                        </button>
                    </div>
                </div>
                <div className={
                        "lg:flex flex-grow hover:transition-all duration-300 items-center" + (
                        navbarOpen ? " flex" : " hidden"
                    )
                    }
                    id="example-navbar-danger"> {
                    email.email ? (<ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                        <li className="nav-item">
                            <Link to="/" className="px-3 py-2 flex items-center text-base uppercase font-semibold leading-snug text-black hover:opacity-75">
                                <i className="text-lg leading-lg text-white opacity-75"></i>
                                <span className="ml-2">Home</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/addcourse" className="px-3 py-2 flex items-center text-base uppercase font-semibold leading-snug text-black hover:opacity-75">
                                <i className="text-lg leading-lg text-white opacity-75"></i>
                                <span className="ml-2">About</span>
                            </Link>
                        </li>

                        <li className="nav-item">
                            <button className="px-3 py-2 flex items-center text-base uppercase font-semibold leading-snug text-black hover:opacity-75"
                                onClick={handleLogout}>
                                <i className="text-lg leading-lg text-white opacity-75"></i>
                                <span className="ml-2">Logout</span>
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="px-3 py-2 lg:flex hidden items-center text-xl uppercase font-semibold leading-snug text-black hover:opacity-75"
                                onClick={()=>setShow(true)}>
                                <i className="text-lg leading-lg text-white opacity-75"></i>
                                <span className="flex ml-2"><FaCartShopping /><span className="-translate-y-3 " >{cartItemsInfo.length===0? null : cartItemsInfo.length}</span> </span>
                            </button>
                        </li>
                    </ul>) : <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                        <li className="nav-item">
                            <Link to="/" className="px-3 py-2 flex items-center text-base uppercase font-semibold leading-snug text-black hover:opacity-75" >
                                <i className="text-lg leading-lg text-white opacity-75"></i>
                                <span className="ml-2">Login</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/signup" className="px-3 py-2 flex items-center text-base uppercase font-semibold leading-snug  text-black hover:opacity-75" >
                                <i className="text-lg leading-lg text-white opacity-75"></i>
                                <span className="ml-2">Sign-up</span>
                            </Link>
                        </li>
                    </ul>
                } </div>
            </div>
        </nav>
        <div>
            <Cart visible={show}
                onClose={handleOnClose}/>
        </div>
    </>);
};

export default Navbar
