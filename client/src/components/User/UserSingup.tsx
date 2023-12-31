import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { backendLink } from "../utils/backendLink";

function UserSingup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [token, setToken] = useState("");

    const Signup = async () => {
        try {
            const response: AxiosResponse = await axios.post(`${backendLink}/user/signup`, {
                email: email,
                password: password
            }, {});
            console.log(response)
            if (response.data.message.issues) {
                response.data.message.issues.forEach((issue) => {
                    return window.alert(`${issue.path[0]
                        } ${issue.code
                        }`);
                })
            }
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="h-screen">
            <div className="text-center text-2xl md:text-4xl font-medium pt-6 font-Inter">Welcome To Taste Of <span className="text-green-500">TRIBUTE</span></div>
            <div className="text-center text-xl font-medium pt-6 font-Inter">Singup</div>
            <div className="my-16 flex justify-center">
                <div className="w-4/6 lg:w-4/12 shadow-lg px-10 pt-10 pb-4 btn-neomorph rounded-xl text-center">
                    <div className="mb-3 pt-0">
                        <input type="text" placeholder="Username"
                            onChange={
                                (e) => setEmail(e.target.value)
                            }
                            className="px-3 py-3 placeholder-gray-400 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full" />
                    </div>
                    <div className="mb-3 pt-0">
                        <input type="text" placeholder="Password"
                            onChange={
                                (e) => setPassword(e.target.value)
                            }
                            className="px-3 py-3 placeholder-gray-400 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full" />
                    </div>
                    <div className="text-xs text-left text-gray-500">
                        By creating an account, you agree to our terms and conditions and
                        privacy policy.
                    </div>
                    <div className="flex justify-between items-center mt-3 mb-2">
                        <button type="button"
                            onClick={
                                () => Signup()
                            }
                            className="focus:outline-none text-black btn-neomorph  focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 ">
                            Signup
                        </button>
                        <div className="text-sm text-left pl-4 text-gray-600">
                            Already have an account?
                            <br />
                            <span className="font-Poppins font-semibold text- underline">
                                <Link to='/login'>Login</Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserSingup;
