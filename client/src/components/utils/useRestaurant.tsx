import axios from 'axios';
import {useState, useEffect} from 'react';
import { backendLink } from './backendLink';

function useRestaurant({resId}) {
    const [data, setData] = useState(null);
    useEffect(()=>{
        fetchMenu(resId)
    },[resId])
    // console.log(resId)
    const fetchMenu = async (id:string) => {
        try{
            const res = await axios.get(`${backendLink}/admin/restaurant-details/`+id, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            const response = res.data.restaurantInfo;
            // console.log(response);
            setData(response);
        }
        catch(err){
            // console.log(err);
        }
    }
    console.log(data)
    return data;
}

export default useRestaurant;
