import { Link } from "react-router-dom";
import Button from "../components/Button";
import OnboardingScreen from "../components/OnboardingScreen";

const VerificationPage = () => {
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-[60%] m-8">
                <div className="flex flex-col gap-5 items-center justify-center">
                    <h2 className="text-2xl">OTP Login</h2>
                    <form className="w-4/5 h-4/5 overflow-y-auto relative">
                        <div className="flex flex-col items-center p-8 bg-white rounded-lg">
                            <div className="flex space-x-2" id="otp-container">
                                <input type="text" maxLength={1} className="w-9 h-12 text-center text-xl font-bold text-gray-800 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200" inputMode="numeric" />
                                <input type="text" maxLength={1} className="w-9 h-12 text-center text-xl font-bold text-gray-800 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200" inputMode="numeric" />
                                <input type="text" maxLength={1} className="w-9 h-12 text-center text-xl font-bold text-gray-800 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200" inputMode="numeric" />
                                <input type="text" maxLength={1} className="w-9 h-12 text-center text-xl font-bold text-gray-800 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200" inputMode="numeric" />
                                <input type="text" maxLength={1} className="w-9 h-12 text-center text-xl font-bold text-gray-800 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200" inputMode="numeric" />
                                <input type="text" maxLength={1} className="w-9 h-12 text-center text-xl font-bold text-gray-800 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200" inputMode="numeric" />
                            </div>
                        </div>
                        <p className="text-center font-extralight">Enter the code sent to your phone number</p>
                        <div className="flex flex-col gap-3 w-full mt-8">
                            <Button name="Submit" />
                        </div>
                        <h6 className="text-[10px] m-2.5 text-center">Can't Login?</h6>
                        <div className="flex gap-2 justify-center items-center">
                            <Link to={"/reset-password/email"}><button className="px-5 py-3 w-full bg-[#F9F9F9] text-black rounded-full text-[9px]">Password Reset</button></Link>
                            <Link to={"/reset-password/phone"}><button className="px-8 py-3 w-full bg-[#F9F9F9] text-black rounded-full text-[9px]">OTP Login</button></Link>
                        </div>
                    </form>
                </div>
                <h2 className="font-extralight mt-20">
                    Don't have an account ?
                    <Link to="/sign-up" >
                        <h2 className="text-black inline opacity-100"> Sign up</h2>
                    </Link>
                </h2>
            </div>
            <OnboardingScreen />
        </div>
    );
}

export default VerificationPage;
