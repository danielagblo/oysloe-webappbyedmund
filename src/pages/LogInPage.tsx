import { Link } from "react-router-dom";
import Button from "../components/Button";
import OnboardingScreen from "../components/OnboardingScreen";

const LogInPage = () => {
    return (
        <div className="min-h-screen w-screen flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-[60%] m-8">
                <div className="flex flex-col gap-5 items-center justify-center">
                    <h2 className="text-2xl">Welcome!</h2>
                    <div className="flex flex-col gap-3">
                        <input type="email" placeholder="Email Address" className="border-gray-100 border-2 px-6 py-2 w-full bg-[3px_center] bg-[length:18px_18px] bg-no-repeat bg-[url(email.svg)] rounded-lg focus:border-gray-400  outline-0" />
                        <input type="password" placeholder="Password" className="border-gray-100 border-2 px-6 py-2 w-full bg-[3px_center] bg-[length:18px] bg-no-repeat bg-[url(Passwordkey.svg)] rounded-lg focus:border-gray-400 outline-0" />
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                        <Button />
                        <button className="flex items-center justify-center bg-[#F9F9F9] px-3 py-2.5 w-full rounded-lg text-black gap-3">
                            <img src="https://toppng.com/uploads/preview/google-g-logo-icon-11609362962anodywxeaz.png" alt="Google Logo" className="h-5" />
                            <h2 className="">Sign in with Google</h2>
                        </button>
                    </div>
                </div>
                <h6 className="text-[10px] m-2.5">Can't Login?</h6>
                <div className="flex gap-2 w-4/5 justify-center">
                    <button className="px-1 py-2 w-4/5 bg-[#F9F9F9] text-black rounded-full text-[9px]">Password Reset</button>
                    <button className="px-1 py-2 w-4/5 bg-[#F9F9F9] text-black rounded-full text-[9px]">OTP Login</button>
                </div>
                <h2 className="absolute bottom-20 font-extralight">
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

export default LogInPage;
