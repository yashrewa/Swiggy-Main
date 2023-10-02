import {cartState} from "../atoms/cart";
import {selector} from "recoil";

export const cartItems = selector({
    key: 'cartItems',
    get: ({get}) => {
        return get(cartState)
    },
})
