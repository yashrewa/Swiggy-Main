import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/navbar'
import AdminLogin from './components/admin/AdminLogin'
import AdminSignup from './components/admin/AdminSignup'
import RestaurantList from './components/RestaurantList'
import AddRestaurant from './components/admin/AddRestaurant'
import RestaurantMenu from './components/admin/RestaurantMenu'
import UserLogin from './components/User/UserLogin'
import PaymentSuccess from './components/User/Payment-success'
import UserSingup from './components/User/UserSingup'
import Footer from './components/footer'
import UserRestaurantMenu from './components/User/RestaurantMenu'
import { RecoilRoot, useRecoilState } from 'recoil'
import { userState } from './components/store/atoms/user'
import axios from 'axios'
import { useEffect } from 'react'
import { backendLink } from './components/utils/backendLink'



function App() {


  return (
    <><RecoilRoot>
        <Router>
          <Navbar />
          <InitUser />
          <Routes>
          <Route path="/" element= {<UserLogin />} />
          <Route path="/signup" element= {<UserSingup />} />
        <Route path="/user/payment-success" element= {<PaymentSuccess />} />
          <Route path="/restaurant-list" element= {<RestaurantList />} />
          <Route path="/restaurant-list/restaurantmenu/:resId" element= {<UserRestaurantMenu />} />
          <Route path="/admin/login" element= {<AdminLogin />} />
          <Route path="/admin/signup" element= {<AdminSignup />} />
          <Route path="admin/restaurant-list" element= {<RestaurantList />} />
          <Route path="admin/restaurant-list/restaurantmenu/:resId" element= {<RestaurantMenu />} />
          <Route path="admin/add-restaurant" element= {<AddRestaurant />} />
          </Routes>
          <Footer />
        </Router>
      </RecoilRoot>
    </>
  )
}

export default App


export function InitUser() {
    const [email, setEmail] = useRecoilState(userState)
    console.log(email)
    const fetchUserEmail = async () => {
        const response = await axios.get(`${backendLink}/user/me`, {
            headers: {
                Authorization: `Bearer ${
                    localStorage.getItem('token')
                }`
            }
        })
        console.log(response)
        if (response.data.email) {
            setEmail({email: response.data.email})
        } else {
            setEmail({email: null})
        }
        // console.log(response)
    }
    useEffect(() => {
        fetchUserEmail();
    }, [])

    return(null)
}
