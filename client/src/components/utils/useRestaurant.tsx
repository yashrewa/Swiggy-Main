import axios from 'axios';
import {useState, useEffect} from 'react';

function useRestaurant({resId}) {
    const [data, setData] = useState([]);
    useEffect(()=>{
        fetchMenu(resId)
    },[])
    // console.log(resId)
    const fetchMenu = async (id:string) => {
        try{
            const res = await axios.get('http://localhost:3000/admin/restaurant-details/'+id, {
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
    return data;
}

export default useRestaurant;
