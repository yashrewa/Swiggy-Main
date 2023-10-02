import { selector } from "recoil";
import { userState } from "../atoms/user";


export const userEmail = selector({
    key: "userEmail",
    get: ({ get }) => {
        const user = get(userState)
        return user.email + "hello bhai";
    }
})