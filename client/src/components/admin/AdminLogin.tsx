import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
// import { useSetRecoilState } from "recoil";
// import { userState } from "../store/atoms/user";

function AdminLogin() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    // const setUser = useSetRecoilState(userState)

    const logIn = async (e : Event) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/admin/login", {}, {
                headers: {
                    email: userName,
                    password: password
                }
            });
            // const response = res.data;
            console.log(response)
            if (response.data.message.issues) {
                response.data.message.issues.forEach((issue) => {
                    return window.alert(`${
                        issue.path[0]
                    } ${
                        issue.code
                    }`);
                })
            }
            if (! response.data.token) {
                window.alert("Invalid username or password")
            }
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                navigate('/admin/restaurant-list')
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="text-center text-xl pt-6">Welcome Back</div>
            <div className="my-16 flex flex-grow justify-center after:">
                <div className="w-1/4 shadow-lg shadow-green-600 p-auto rounded-xl text-center">
                    <div className="mb-3 pt-0">
                        <input type="text" placeholder="Username"
                            onChange={
                                (e) => setUserName(e.target.value)
                            }
                            className="px-3 py-3 placeholder-gray-400 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"/>
                    </div>
                    <div className="mb-3 pt-0">
                        <input type="password" placeholder="Password"
                            onChange={
                                (e) => setPassword(e.target.value)
                            }
                            className="px-3 py-3 placeholder-gray-400 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"/>
                    </div>

                    <button type="button"
                        onClick={
                            (e) => logIn(e)
                        }
                        className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-purple-900">
                        Login
                    </button>
                </div>
            </div>
        </>
    );
}

export default AdminLogin;
