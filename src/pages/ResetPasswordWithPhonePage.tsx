import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import OnboardingScreen from "../components/OnboardingScreen";
import useIsSmallScreen from "../hooks/useIsSmallScreen";

const ResetPasswordWithPhonePage = () => {
    const navigate = useNavigate();
    const isSmall = useIsSmallScreen();
    const shouldShowOnboarding = typeof window !== 'undefined' ? localStorage.getItem('oysloe_onboarding_seen') !== 'true' : true;

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-11/12 sm:w-[60%] m-8">
                <div className="flex flex-col gap-5 items-center justify-center">
                    <h2 className="text-2xl">Reset Password</h2>
                    <form className="w-3/5 h-4/5 overflow-y-auto relative">
                        <input type="number" placeholder="+233" className="border-gray-100 border-2 px-8 py-2 w-full bg-[8px_center] bg-[length:18px_18px] bg-no-repeat bg-[url(phone.svg)] rounded-lg focus:border-gray-400  outline-0" />
                        <p className="text-center font-extralight">We'll send a verification link to the number if it begins in our system</p>
                        <div className="flex flex-col gap-3 w-full mt-8">
                            <Button name="Submit" onClick={(e) => { e.preventDefault(); navigate("/verification"); console.log("Submit button clicked"); }} />
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
                    <Link to="/signUp" >
                        <h2 className="text-black inline opacity-100"> Sign up</h2>
                    </Link>
                </h2>
            </div>
            {isSmall ? (shouldShowOnboarding ? <OnboardingScreen overlay onFinish={() => navigate('/login')} /> : null) : <OnboardingScreen />}
        </div>
    );
}

export default ResetPasswordWithPhonePage;
