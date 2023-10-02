import { useNavigate } from "react-router-dom";



function PaymentSuccess(){
    const navigate = useNavigate();
    setTimeout(() => {
        navigate('/restaurant-list')
    }, 3000);
    
    return (
    <div className="flex justify-center h-screen w-auto">
        <div className="text-2xl lg:text-5xl justify-items-center align-middle" >
            Your Payment is successful
        </div>
        </div>
    
)}

export default PaymentSuccess;