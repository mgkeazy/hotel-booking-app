import { Link } from "react-router-dom"
import { UseAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () =>{

    const {isLoggedIn} = UseAppContext();


    return (
        <div className="bg-blue-800 py-6">
            <div className="container mx-auto flex justify-between">
                <span className="font-Nunito text-3xl text-white font-bold tracking-tight">
                    <Link to="/">MernHolidays.com</Link>
                </span>
                <span className="flex space-x-2">
                    {isLoggedIn ? <>
                       <Link  className="flex items-center text-white px-3 font-bold hover:bg-blue-600 font-Nunito" to="/my-bookings">
                        My Bookings</Link> 
                        <Link className="flex items-center text-white px-3 font-bold hover:bg-blue-600 font-Nunito" to="/my-hotels">
                        My Hotels</Link>
                        <SignOutButton/>
                    </>:
                    <Link  to="/sign-in"
                        className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-100 font-Nunito">
                        Sign In
                    </Link>
                    }
                </span>
            </div>
        </div>
    )
}
export default Header;