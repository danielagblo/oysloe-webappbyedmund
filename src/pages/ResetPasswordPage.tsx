import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import LottieSuccess from "../components/LottieSuccess";

const ResetPasswordPage = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-[60%] m-8">
                <div className="flex flex-col gap-5 items-center justify-center">
                    <h2 className="text-2xl">Reset Password</h2>
                    <div>
                        {/* {image of password reset} */}
                        <img src="Passwordkey.svg" alt="Reset Password Illustration" className="h-30" />
                    </div>
                    <form className="relative">
                        <div className="flex flex-col gap-3">
                            <input type="password" placeholder="New Password" className="border-gray-100 border-2 px-8 py-2 w-full bg-[8px_center] bg-[length:18px] bg-no-repeat bg-[url(Passwordkey.svg)] rounded-lg focus:border-gray-400 outline-0" />
                            <input type="password" placeholder="Confirm New Password" className="border-gray-100 border-2 px-8 py-2 w-full bg-[8px_center] bg-[length:18px] bg-no-repeat bg-[url(Passwordkey.svg)] rounded-lg focus:border-gray-400 outline-0" />
                        </div>
                        <div className="flex flex-col gap-3 w-full mt-3">
                            <Button onClick={(e) => { e.preventDefault(); setShowModal(true); }} name="Reset Password" />
                        </div>
                    </form>
                </div>
                <h2 className="font-extralight mt-20">
                    Finished resetting your password ?
                    <Link to="/login" >
                        <h2 className="text-black inline opacity-100"> Sign In</h2>
                    </Link>
                </h2>
            </div>
            {showModal && (
                <div className="h-2/5 w-2/7 flex flex-col justify-center items-center bg-white border-2 border-gray-100 rounded-4xl shadow-lg absolute z-10">
                    <LottieSuccess />
                    <h2 className="text-2xl text-center">Password successfully<br />reset!</h2>
                    <button onClick={() => setShowModal(false)} className="text-center bg-[#F9F9F9] px-3 py-2 rounded-lg text-black">Close</button>
                </div>
            )}
        </div>
    );
}

export default ResetPasswordPage;
