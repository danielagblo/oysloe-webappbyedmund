import { useState } from "react";
import LottieJourneyBeginSnow from "./LottieJourneyBeginSnow";
import LottieScaleToSuccess from "./LottieScaleToSuccess";
import LottieUserSafetyGuarantee from "./LottieUserSafetyGuarantee";

const OnboardingScreen = () => {
    const [clicked, setClicked] = useState(0);
    return (
        <div className="flex flex-col items-center justify-center h-[80vh] m-8 bg-[#DEFEED] w-full rounded-4xl">
            {clicked === 0 ? (
                <>
                    < LottieUserSafetyGuarantee />
                    <div className="flex flex-col items-center justify-center">
                        <h2 className="text-4xl font-medium">User Safety <br /> Guarantee </h2>
                        <p className="text-center text-sm w-7/10 px-8">Buyers and sellers undergo strict checks and verification to ensure authenticity and reliability</p>
                        <div className="flex my-6 gap-2">
                            <span className="h-5 w-5 bg-black rounded-full inline-block mx-1"></span>
                            <span className="h-5 w-5 bg-gray-400 rounded-full inline-block mx-1"></span>
                            <span className="h-5 w-5 bg-gray-400 rounded-full inline-block mx-1"></span>
                        </div>
                        <button onClick={() => { setClicked(1); console.log(clicked) }} className="px-6 py-3 w-1/2 bg-[#F9F9F9] text-black rounded-lg">Next</button>
                    </div>
                </>
            ) : clicked === 1 ? (
                <>
                    <LottieScaleToSuccess />
                    <div className="flex flex-col items-center justify-center">
                        <h2 className="text-4xl font-medium">User Safety <br /> Guarantee </h2>
                        <p className="text-center text-sm w-7/10 px-8">Buyers and sellers undergo strict checks and verification to ensure authenticity and reliability</p>
                        <div className="flex my-6 gap-2">
                            <span className="h-5 w-5 bg-gray-400 rounded-full inline-block mx-1"></span>
                            <span className="h-5 w-5 bg-black rounded-full inline-block mx-1"></span>
                            <span className="h-5 w-5 bg-gray-400 rounded-full inline-block mx-1"></span>
                        </div>
                        <button onClick={() => { setClicked(2); console.log(clicked) }} className="px-6 py-3 w-1/2 bg-[#F9F9F9] text-black rounded-lg">Next</button>
                    </div>
                </>
            ) : clicked === 2 ? (
                <>
                    <LottieJourneyBeginSnow />
                    <div className="flex flex-col items-center justify-center">
                        <h2 className="text-4xl font-medium">User Safety <br /> Guarantee </h2>
                        <p className="text-center text-sm w-7/10 px-8">Buyers and sellers undergo strict checks and verification to ensure authenticity and reliability</p>
                        <div className="flex my-6 gap-2">
                            <span className="h-5 w-5 bg-gray-400 rounded-full inline-block mx-1"></span>
                            <span className="h-5 w-5 bg-gray-400 rounded-full inline-block mx-1"></span>
                            <span className="h-5 w-5 bg-black rounded-full inline-block mx-1"></span>
                        </div>
                        <button onClick={() => { setClicked(3); console.log(clicked) }} className="px-6 py-3 w-1/2 bg-[#F9F9F9] text-black rounded-lg">Get Started</button>
                    </div>
                </>
            ) : (
                <>
                    {document.getElementsByTagName("input")[0].focus()}
                    <LottieJourneyBeginSnow />
                    <div className="flex flex-col items-center justify-center">
                        <h2 className="text-4xl font-medium">User Safety <br /> Guarantee </h2>
                        <p className="text-center text-sm w-7/10 px-8">Buyers and sellers undergo strict checks and verification to ensure authenticity and reliability</p>
                        <div className="flex my-6 gap-2">
                            <span className="h-5 w-5 bg-gray-400 rounded-full inline-block mx-1"></span>
                            <span className="h-5 w-5 bg-gray-400 rounded-full inline-block mx-1"></span>
                            <span className="h-5 w-5 bg-black rounded-full inline-block mx-1"></span>
                        </div>
                        <button onClick={() => { setClicked(4); console.log(clicked) }} className="px-6 py-3 w-1/2 bg-[#F9F9F9] text-black rounded-lg">Get Started</button>
                    </div>
                </>
            )}
        </div >
    )
}
export default OnboardingScreen;
