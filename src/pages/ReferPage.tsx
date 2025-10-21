import { useState } from 'react';
import '../App.css';
import Button from '../components/Button';
import MenuButton from '../components/MenuButton';
import ProfileSidebar from '../components/ProfileSidebar';
const ReferPage = () => {
    const [how, setHow] = useState(true);
    const [redraw, setRedraw] = useState(false);
    const [apply, setApply] = useState(false);
    const How = () => (
        <div className='h-full w-full px-8 py-9 bg-white rounded-2xl flex flex-col justify-around items-start'>
            <div>
                <h2 className='text-sm'>We value friendship</h2>
                <h2 className='text-xs'>Follow the steps below and get rewarded</h2>
            </div>
            <div className='flex mt-8 mb-8 justify-start gap-2'>
                <img src="/steps.svg" alt="" className='w-10 h-auto ml-5' />
                <div className='flex flex-col justify-evenly gap-6 mb-0'>
                    <div><h2 className='text-xs inline'>Share your code</h2><img src="/copy.svg" className='inline w-3 h-auto' alt="" /></div>
                    <h2 className='text-xs'>Your friend adds the code</h2>
                    <h2 className='text-xs'>Your friend places an order</h2>
                </div>
            </div>
            <div className='flex gap-8 justify-center items-center'>
                <img src="/earn.svg" alt="" className='w-5 h-5' />
                <div>
                    <h2 className='text-sm'>You get</h2>
                    <h2 className='text-xs'>50 Points</h2>
                </div>
            </div>
            <div className='flex gap-8 justify-center items-center'>
                <img src="/Redeem.svg" alt="" className='w-5 h-5' />
                <div>
                    <h2 className='text-sm'>They get</h2>
                    <h2 className='text-xs'>Discount coupon 10 points</h2>
                </div>
            </div>
            <div className='h-16' />
        </div>
    )
    const Refer = () => (
        <div className='h-full w-full flex flex-col gap-4'>
            <div className="bg-white w-full h-24 rounded-2xl p-5 flex justify-between items-center">
                <div className='flex gap-2 my-2'>
                    <img src="/star green.svg" alt="" className="w-4 h-4 my-auto" />
                    <h2 className='text-sm'>Points</h2>
                </div>
                <div className='flex flex-col gap-1'>
                    <div className='flex gap-6 ' onClick={() => { setHow(true); setApply(false); setRedraw(false); }}>
                        <span className='text-xl'>10,000</span>
                        <img src="/arrowright.svg" alt="" />
                    </div>
                    <span className='-m-3 pt-1 pl-4 text-xs'>equals 10</span>
                </div>
            </div>
            <div className='flex gap-4 w-full'>
                <div className='bg-white w-full h-24 rounded-2xl p-3 flex justify-between items-center gap-2'>
                    <div className='flex flex-col items-center justify-between gap-2'>
                        <img src="/earn.svg" className='w-5 h-5' alt="" />
                        <span className='text-sm'>Earn</span>
                    </div>
                </div>
                <div className='bg-white w-full h-24 rounded-2xl p-3 flex justify-between items-center gap-2' onClick={() => { setRedraw(true); setHow(false); setApply(false); }}>
                    <div className='flex flex-col items-center justify-between gap-2'>
                        <img src="/Redeem.svg" className='w-5 h-5' alt="" />
                        <span className='text-sm'>Redeem</span>
                    </div>
                    <img src="/arrowright.svg" alt="" />

                </div>
            </div>
            <div className='bg-white w-full h-24 pt-10 rounded-2xl p-2 gap-2 flex justify-between items-center' onClick={() => { setRedraw(false); setHow(false); setApply(true); }}>
                <div className=' flex flex-col justify-between '>
                    <h2 className='text-sm'>Gold (Level)</h2>
                    <h3 className='text-xs'>9,000 points to diamond</h3>
                    <div className='w-9 h-1 bg-[var(--green)]'></div>
                </div>
                <img className='mb-9' src="/arrowright.svg" alt="" />
            </div>
            <div className='bg-white w-full h-full rounded-2xl p-3 flex flex-col justify-between items-start px-4 pt-8 pb-18'>
                <div className='w-full flex flex-col justify-center gap-2'>
                    <h2 className='text-sm 2xl:text-xl'>Refer Your friends and Earn</h2>
                    <span><img src="/ok.svg" alt="" className='inline' /><h2 className='text-xs inline pl-3'>Pro Partnership status</h2></span>
                    <span><img src="/ok.svg" alt="" className='inline' /><h2 className='text-xs inline pl-3'>All Ads stays promoted for a month</h2></span>
                    <span><img src="/ok.svg" alt="" className='inline' /><h2 className='text-xs inline pl-3'>Share unlimited number of Ads </h2></span>
                    <span><img src="/ok.svg" alt="" className='inline' /><h2 className='text-xs inline pl-3'>Boost your business</h2></span>
                </div>
                <div className='mt-5 w-full'>
                    <h2 className='text-xs'>You've referred 0 friends</h2>
                    <div className='flex gap-2 items-center justify-between w-full'>
                        <input
                            type='text'
                            value='DAN2785'
                            readOnly
                            className='border border-[var(--div-border)] rounded px-2 py-1 w-24 text-center bg-gray-50 text-md'
                        />
                        <button
                            className=' px-3 py-1 rounded text-md'
                            onClick={() => navigator.clipboard.writeText('DAN2785')}
                        >
                            Copy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
    const Redraw = () => (
        <div className='h-full w-full px-8 bg-white rounded-2xl flex flex-col gap-6'>
            <div className='flex items-center p-3 flex-col'>
                <h1>10</h1>
                <Button name='Redraw' />
            </div>
            <div>
                <div>
                    <p className='text-xs '>Payment</p>
                    <p className='text-xs'>Recent transactions</p>
                </div>

                <div>
                    <div className='border-b pb-1 gap-2 flex items-center'>
                        <p className='text-xs'>Apr, 7 2024</p>
                        <p className='text-xs'>20 points</p>
                        <p className='ml-auto'>430</p>
                    </div>
                    <div className='border-b pb-1 gap-2 flex items-center'>
                        <p className='text-xs'>Apr, 7 2024</p>
                        <p className='text-xs'>20 points</p>
                        <p className='ml-auto'>430</p>
                    </div>
                    <div className='border-b pb-1 gap-2 flex items-center'>
                        <p className='text-xs'>Apr, 7 2024</p>
                        <p className='text-xs'>20 points</p>
                        <p className='ml-auto'>430</p>
                    </div>
                </div>
            </div>

        </div>
    );

    const Apply = () => (
        <div className='h-full w-full flex flex-col gap-4'>
            <div className='bg-white w-full h-56 rounded-2xl p-5 flex flex-col justify-between items-start gap-8'>
                <div className='flex gap-2'>
                    <img src="/Redeem.svg" alt="" className='w-5 h-5' /><h2 className='inline'>Apply Coupon</h2>
                </div>
                <div className='flex justify-between w-full'><h2>Get Cash equivalent</h2><h2>0</h2></div>
                <div><input type="text" className="" placeholder='Add code here' /> <button className='bg-[var(--div-active)] px-3 py-2'>Apply</button></div>
            </div>
            <div className='w-full h-full p-3 bg-white rounded-2xl px-4 pt-8 pb-18'>
                <div className='w-full h-full flex flex-col justify-center gap-8'>
                    <div className=' flex flex-col justify-between '>
                        <h2 className='text-sm'>Silver</h2>
                        <h3 className='text-xs'>10 points to silver</h3>
                        <div className='w-9 h-1 bg-[var(--green)]'></div>
                    </div>
                    <div className=' flex flex-col justify-between '>
                        <h2 className='text-sm'>Gold</h2>
                        <h3 className='text-xs'>100,000 points to gold</h3>
                        <div className='w-9 h-1 bg-[var(--green)]'></div>
                    </div>
                    <div className=' flex flex-col justify-between '>
                        <h2 className='text-sm'>Diamond</h2>
                        <h3 className='text-xs'>1,000,000 points to diamond</h3>
                        <div className='w-9 h-1 bg-[var(--green)]'></div>
                    </div>
                    <h2 className='text-sm'>Your earning levels also helps us to rank you.</h2>
                </div>
            </div>
        </div>
    );
    return (
        <div className="flex justify-between h-screen w-screen items-center bg-[#f3f4f6]">
            <div className="w-2/14 h-full">
                <ProfileSidebar />
            </div>
            <div className="w-full flex p-3 m-2 h-full overflow-auto no-scrollbar gap-4">
                <Refer />
                {how ? <How /> : apply ? <Apply /> : redraw ? <Redraw /> : null}
            </div>
            <div className=" md:w-1/5 w-full hidden h-full md:flex flex-col items-center justify-around gap-2 mr-3 my-3">
                <div className="flex p-4 bg-white rounded-2xl flex-col items-center gap-2 justify-center w-full h-1/2 show">
                    <img src="/face.svg" alt="" className="w-24 h-24 border-green-300 border-2 p-2 rounded-full" />
                    <div>
                        <h3 className="font-medium text-2xl">Alexander Kowri</h3>
                        <div className="flex flex-col items-center gap-0.5 w-full">
                            <div className="flex px-1 rounded items-center  mr-auto">
                                <img src="/tick.svg" alt="" className="w-1.5 h-1.5" />
                                <span className="text-[6px]">High level</span>
                            </div>
                            <div className="bg-green-300 h-1 w-full px-2"></div>
                        </div>
                    </div>
                    <div className="flex flex-row-reverse w-full text-center justify-around">
                        <div className="flex flex-col-reverse">
                            <h3 className="text-[7px] text-center text-gray-500">Sold Ads</h3><h3>2k</h3>
                        </div>
                        <div className="flex flex-col-reverse ">
                            <h3 className="text-[7px] text-center text-gray-600">Active Ads</h3><h3>2k</h3>
                        </div>
                    </div>
                </div>
                <div className="flex bg-white rounded-2xl flex-col items-center gap-1 justify-center w-full h-1/2 p-2">
                    <span className="text-3xl text-center font-medium w-full">4.5</span>
                    <div className="flex">
                        <img src="/star.svg" alt="" className="w-3 h-3" />
                        <img src="/star.svg" alt="" className="w-3 h-3" />
                        <img src="/star.svg" alt="" className="w-3 h-3" />
                        <img src="/star.svg" alt="" className="w-3 h-3" />
                        <img src="/star.svg" alt="" className="w-3 h-3" />
                    </div>
                    <h2 className="text-gray-600 text-[8px]">20 reviews</h2>
                    <div className="space-y-2 w-full">
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-2">
                                <img src="/star.svg" alt="" className="w-4 h-4" />
                                <h3 className="w-4 text-xs">{rating}</h3>
                                <div className="flex-1 bg-gray-200 rounded-full h-1">
                                    <div className="bg-gray-700 h-1 rounded-full" style={{ width: `${rating * 20}%` }}></div>
                                </div>
                                <span className="w-6 text-xs text-gray-600">{rating * 4}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <MenuButton />
        </div>
    );
}

export default ReferPage;
