import { useState } from "react";
import LottieJourneyBeginsNow from "./LottieJourneyBeginsNow";
import LottieScaleToSuccess from "./LottieScaleToSuccess";
import LottieUserSafetyGuarantee from "./LottieUserSafetyGuarantee";

type Props = {
    overlay?: boolean;
    onFinish?: () => void;
};

const OnboardingScreen = ({ overlay = false, onFinish }: Props) => {
    const [clicked, setClicked] = useState(0);
    const [visible, setVisible] = useState(true);
    const baseClass = overlay
        ? `fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#DEFEED] p-6 ${visible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`
        : 'flex flex-col items-center justify-center h-screen bg-[#DEFEED] w-1/2';

    const STORAGE_KEY = 'oysloe_onboarding_seen';

    // if overlay and already seen, immediately call onFinish
    if (typeof window !== 'undefined' && overlay && localStorage.getItem(STORAGE_KEY) === 'true') {
        if (onFinish) onFinish();
    }

    const handleFinish = () => {
        if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, 'true');
        setVisible(false);
        setTimeout(() => {
            if (onFinish) onFinish();
        }, 300);
    };
    return (
        <div className={baseClass}>
            {clicked === 0 ? (
                <>
                    < LottieUserSafetyGuarantee />
                    <div className="flex flex-col items-center justify-center gap-3">
                        <h2 className="text-4xl font-medium text-center">User Safety Guarantee </h2>
                        <p className="text-center text-sm w-7/10 px-8">Buyers and sellers undergo strict checks and verification to ensure authenticity and reliability</p>
                        <div className="flex gap-2">
                            <span className="h-5 w-5 bg-black rounded-full inline-block mx-1"></span>
                            <span className="h-5 w-5 bg-gray-400 rounded-full inline-block mx-1"></span>
                            <span className="h-5 w-5 bg-gray-400 rounded-full inline-block mx-1"></span>
                        </div>
                        <button onClick={() => { setClicked(1); console.log(clicked) }} className="px-3 py-1.5 h-4/5 w-1/2 bg-[#F9F9F9] text-black rounded-lg">Next</button>
                    </div>
                </>
            ) : clicked === 1 ? (
                <>
                    <LottieScaleToSuccess />
                    <div className="flex flex-col items-center justify-center gap-3">
                        <h2 className="text-4xl font-medium text-center">Scale To Success</h2>
                        <p className="text-center text-sm w-7/10 px-8">Buyers and sellers undergo strict checks and verification to ensure authenticity and reliability</p>
                        <div className="flex gap-2">
                            <span className="h-5 w-5 bg-gray-400 rounded-full inline-block mx-1"></span>
                            <span className="h-5 w-5 bg-black rounded-full inline-block mx-1"></span>
                            <span className="h-5 w-5 bg-gray-400 rounded-full inline-block mx-1"></span>
                        </div>
                        <button onClick={() => { setClicked(2); console.log(clicked) }} className="px-3 py-1.5 h-4/5 w-1/2 bg-[#F9F9F9] text-black rounded-lg">Next</button>
                    </div>
                </>
            ) : clicked === 2 ? (
                <>
                    <LottieJourneyBeginsNow />
                    <div className="flex flex-col items-center justify-center gap-3">
                        <h2 className="text-4xl font-medium text-center">Journey Begins Now</h2>
                        <p className="text-center text-sm w-7/10 px-8">Buyers and sellers undergo strict checks and verification to ensure authenticity and reliability</p>
                        <div className="flex gap-2">
                            <span className="h-5 w-5 bg-gray-400 rounded-full inline-block mx-1"></span>
                            <span className="h-5 w-5 bg-gray-400 rounded-full inline-block mx-1"></span>
                            <span className="h-5 w-5 bg-black rounded-full inline-block mx-1"></span>
                        </div>
                        <button onClick={() => { setClicked(3); console.log(clicked) }} className="px-3 py-1.5 h-4/5 w-1/2 bg-[#F9F9F9] text-black rounded-lg">Get Started</button>
                    </div>
                </>
            ) : (
                <>
                    {typeof document !== 'undefined' && document.getElementsByTagName("input")[0]?.focus()}
                    <LottieJourneyBeginsNow />
                    <div className="flex flex-col items-center justify-center gap-3">
                        <h2 className="text-4xl font-medium text-center">Journey Begins Now</h2>
                        <p className="text-center text-sm w-7/10 px-8">Buyers and sellers undergo strict checks and verification to ensure authenticity and reliability</p>
                        <div className="flex gap-2">
                            <span className="h-5 w-5 bg-gray-400 rounded-full inline-block mx-1"></span>
                            <span className="h-5 w-5 bg-gray-400 rounded-full inline-block mx-1"></span>
                            <span className="h-5 w-5 bg-black rounded-full inline-block mx-1"></span>
                        </div>
                        <button onClick={() => {
                            setClicked(4);
                            console.log(clicked);
                            if (overlay) {
                                handleFinish();
                            } else {
                                // non-overlay flow: just advance
                                setClicked(4);
                            }
                        }} className="px-3 py-1.5 h-4/5 w-1/2 bg-[#F9F9F9] text-black rounded-lg">Get Started</button>
                    </div>
                </>
            )}
        </div >
    )
}
export default OnboardingScreen;
