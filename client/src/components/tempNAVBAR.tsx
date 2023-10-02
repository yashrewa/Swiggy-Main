import Logo from "./constants/Logo";
import { Link } from "react-router-dom";
import { userState } from "./store/atoms/user";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { userEmail } from "./store/selectors/userEmail";
import { cartItems } from "./store/selectors/cartData";
import { showState } from "./store/atoms/show";


const tempNavbar = () => {
  const email = useRecoilValue(userState)
  const setEmail = useSetRecoilState(userState)
  const cartItemsInfo = useRecoilValue(cartItems)
  const setShow = useSetRecoilState(showState)
  console.log(cartItemsInfo.length)


  
  //  const cartItems = useSelector(store => store.cart.items)
    const navigate = useNavigate();
    console.log(email.email)

    const handleLogout = () => {
      localStorage.removeItem('token')
      navigate('/')
      setEmail({email: null})
    }
    return (
      
      <div className="lg:px-3 flex justify-center lg:top lg:justify-between">
        <div className="pl-2 pt-2">{email.email? <Link to="/restaurant-list"><Logo /> </Link>:  <Link to="/"><Logo /></Link> }</div>
        
        <div className="hidden lg:block">
            {email.email? (
          <ul className="lg:flex lg:p-2">
              <li className="p-3 lg:text-xl pt-2 font-Sans-serif "><Link to="/">Home</Link></li>
              <li className="p-3 lg:text-xl pt-2 font-Sans-serif "><Link to="/about">About</Link></li>
              <li className="p-3 lg:text-xl pt-2 font-Sans-serif hover:cursor-pointer " onClick={handleLogout}>Logout</li>
              <li className="p-3 lg:text-xl pt-2 font-Sans-serif hover:cursor-pointer" onClick={e=>setShow(true)} >🛒 {cartItemsInfo.length===0? null : cartItemsInfo.length}</li>
          </ul>

            ): <>
              <ul className="lg:flex lg:p-2">
              <li className="p-3 lg:text-xl pt-2 font-Sans-serif "><Link to="/">Login</Link></li>
              <li className="p-3 lg:text-xl pt-2 font-Sans-serif "><Link to="/about">Singup</Link></li>
              {/* <li className="p-3 lg:text-xl pt-2 font-Sans-serif ">🛒</li> */}
          </ul>
            </>}
        </div>
      </div>
    );
  };

  export default tempNavbar