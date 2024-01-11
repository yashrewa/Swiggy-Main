import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { useSetRecoilState } from "recoil";
// import { userState } from "../store/atoms/user";
import { backendLink } from "../utils/backendLink";
import { Link } from "react-router-dom";

function UserLogin() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    // const setUser = useSetRecoilState(userState)

    const logIn = async () => {

        try {
            const response = await axios.post(`${backendLink}/user/login`, {}, {
                headers: {
                    email: userName,
                    password: password
                }
            });
            if (response.data.message.issues) {
                response.data.message.issues.forEach((issue) => {
                    return window.alert(`${issue.path[0]
                        } ${issue.code
                        }`);
                })
            }
            if (!response.data.token) {
                window.alert("Invalid username or password")
            }
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                navigate('/restaurant-list')
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="h-screen">
            <div className="text-center text-2xl md:text-4xl font-medium pt-6 font-Inter">Welcome To Taste Of <span className="text-green-500">TRIBUTE</span></div>
            <div className="text-center text-xl font-medium pt-6 font-Inter">Login Required</div>
            <div className="my-16 flex flex-grow justify-center">
                <div className="w-4/6 lg:w-4/12 shadow-lg px-10 pt-10 pb-4 btn-neomorph rounded-xl text-center">
                    <div className="mb-3 pt-0">
                        <input type="text" placeholder="Username" value={`user`}
                            onChange={
                                (e) => setUserName(e.target.value)
                            }
                            className="px-3 py-3 placeholder-gray-400 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full" />
                    </div>
                    <div className="mb-3 pt-0">
                        <input type="password" placeholder="Password"
                            value={`password123`}
                            onChange={
                                (e) => setPassword(e.target.value)
                            }
                            className="px-3 py-3 placeholder-gray-400 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full" />
                    </div>
                    <div className="flex justify-between pt-6">

                        <button type="button"
                            onClick={
                                () => logIn()
                            }
                            className="focus:outline-none text-black btn-neomorph  focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 ">
                            Login
                        </button>
                        <div className="text-sm text-left pl-4 text-gray-600">
                        Already have an account?
                        <br/>
                        <span className="font-Poppins font-semibold text- underline">
                            <Link to='/signup'>Singup</Link>
                        </span>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserLogin;
