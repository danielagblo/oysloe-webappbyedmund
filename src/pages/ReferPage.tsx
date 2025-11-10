import { useState, useEffect } from "react";
import "../App.css";
import Button from "../components/Button";
import MenuButton from "../components/MenuButton";

const ReferPage = () => {

  const [how, setHow] = useState(false);
  const [redraw, setRedraw] = useState(false);
  const [apply, setApply] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setHow(true);
    }
  }, []);


  const paymentData = [
    { date: "Apr 7, 2024", points: "20 points", total: "$430" },
    { date: "Apr 8, 2024", points: "10 points", total: "$440" },
    { date: "Apr 9, 2024", points: "30 points", total: "$470" },
    { date: "Apr 10, 2024", points: "15 points", total: "$485" },
    { date: "Apr 11, 2024", points: "25 points", total: "$510" },
  ];


  const Refer = () => (
    <div className="h-full md:min-h-[92vh] md:mt-5 md:overflow-auto no-scrollbar w-full flex flex-col gap-2">
      <div className="bg-white w-4/5 mr-2 md:mr-0 md:w-full h-20 rounded-2xl p-5 flex justify-between items-center shadow-sm self-end">
        <div className="flex gap-2 my-2">
          <img src="/star green.svg" alt="" className="w-4 h-4 md:w-[1.2vw] md:h-[1.2vw] my-auto" />
          <h2 className="text-sm md:text-[1.2vw]">Points</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div
            className="flex gap-6 "
            onClick={() => {
              setHow(true);
              setApply(false);
              setRedraw(false);
            }}
          >
            <span className="text-xl">10,000</span>
            <img className="md:-mr-2" src="/arrowright.svg" alt="" />
          </div>
          <span className="-m-3 pt-1 pl-4 text-xs text-gray-400">equals &#8804;10</span>
        </div>
      </div>
      <div className="flex gap-4 w-full px-2 md:px-0">
        <div className="bg-white w-full h-20 rounded-2xl p-3 flex justify-between items-center gap-2 shadow-sm">
          <div className="flex flex-col items-center justify-between gap-2">
            <img src="/earn.svg" className="w-5 h-5 md:w-[2vw] md:h-[2vw] md:mx-2" alt="earn" />
            <span className="text-sm md:text-[1vw]">Earn</span>
          </div>
        </div>
        <div
          className="bg-white shadow-sm w-full h-20 rounded-2xl p-3 flex justify-between items-center gap-2"
          onClick={() => {
            setRedraw(true);
            setHow(false);
            setApply(false);
          }}
        >
          <div className="flex flex-col items-center justify-between gap-2">
            <img src="/Redeem.svg" className="w-5 h-5 md:w-[2vw] md:h-[2vw] md:mx-1" alt="redeem" />
            <span className="text-sm md:text-[1vw]">Redeem</span>
          </div>
          <img src="/arrowright.svg" alt="" />
        </div>
      </div>
      <div
        className="bg-white shadom-sm w-[96%] ml-2 md:ml-0 md:w-full h-24 pt-6 rounded-2xl p-2 flex justify-between items-center"
        onClick={() => {
          setRedraw(false);
          setHow(false);
          setApply(true);
        }}
      >
        <div className="flex flex-col justify-between w-full">
          <h2 className="text-sm md:text-[1.2vw]">Gold (Level)</h2>
          <h3 className="text-xs text-gray-400 md:text-[1vw]">9,000 points to diamond</h3>
          <div className="relative bg-[#defeed] w-8/10 h-1 my-2">
            <div className="absolute left-0 w-9 h-1 bg-[var(--green)]"/>
          </div>
        </div>
        <img className="mb-9" src="/arrowright.svg" alt="" />
      </div>
      <div className="bg-white w-full h-full shadom-sm rounded-2xl p-3 flex flex-col md:justify-between items-start px-4 pt-6 pb-18">
        <div className="w-full flex flex-col justify-center gap-2">
          <h2 className="text-sm 2xl:text-xl md:text-[1.5vw]">Refer Your friends and Earn</h2>
          <span>
            <p className="inline">&#10004;</p>
            <h2 className="text-xs md:text-[1vw] inline pl-3 text-gray-400">Pro Partnership status</h2>
          </span>
          <span>
            <p className="inline">&#10004;</p>
            <h2 className="text-xs md:text-[1vw] inline pl-3 text-gray-400">
              All Ads stays promoted for a month
            </h2>
          </span>
          <span>
            <p className="inline">&#10004;</p>
            <h2 className="text-xs md:text-[1vw] inline pl-3 text-gray-400">
              Share unlimited number of Ads
            </h2>
          </span>
          <span>
            <p className="inline">&#10004;</p>
            <h2 className="text-xs md:text-[1vw] inline pl-3 text-gray-400">Boost your business</h2>
          </span>
        </div>
        <div className=" mt-10 md:mt-5 w-full">
          <h2 className="text-xs md:text-[1vw] text-gray-400">You've referred 0 friends</h2>
          <div className="flex gap-2 items-center justify-between w-full">
            <div className="py-2 rounded-lg mt-3 relative flex flex-row gap-3 justify-center border border-[var(--div-border)] items-center w-full">
              <input
              type="text"
              value="DAN2785"
              readOnly
              className="py-1 focus:border-none rounded text-md md:text-[2vw]"
              />
              <button 
                className="absolute right-1 top-1 md:right-2 md:top-2 md:h-4/5 md:px-6 hover:text-gray-500 hover:cursor-pointer bg-[var(--div-active)] rounded-lg px-3 py-2"
                onClick={() => navigator.clipboard.writeText("DAN2785")}
              >Copy</button>
            </div>
          </div>
          <div className="w-full h-5" />
        </div>
      </div>
    </div>
  );
  const How = () => (
    <div className="h-full md:min-h-[92vh] md:mt-5 md:overflow-auto no-scrollbar w-full px-8 py-9 bg-white rounded-2xl flex flex-col gap-1 items-start">
      <div>
        <h2 className="text-sm md:text-[1.2vw]">We value friendship</h2>
        <h2 className="text-xs text-gray-400 md:text-[1vw]">Follow the steps below and get rewarded</h2>
      </div>
      <div 
        className="w-full flex -ml-13 justify-start gap-4 p-12">
        <img src="/steps.svg" alt="" className="w-10 h-auto ml-5" />
        <div className="flex flex-col justify-evenly gap-6 mb-0">
          <div className="inline whitespace-nowrap">
            <h2 className="text-xs inline text-gray-600 md:text-[1vw]">Share your code </h2>
            <img 
              src="/copy.svg" 
              className="inline w-3 h-auto" 
              alt=""
            />
          </div>
          <h2 className="text-xs text-gray-600 md:text-[1vw]">Your friend adds the code</h2>
          <h2 className="text-xs text-gray-600 md:text-[1vw]">Your friend places an order</h2>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-8 justify-start items-center">
          <img src="/earn.svg" alt="" className="w-6 h-6 md:w-[2vw] md:h-[2vw]" />
          <div>
            <h2 className="text-sm text-gray-400 md:text-[1.2vw]">You get</h2>
            <h2 className="text-xs md:text-[1vw]">50 Points</h2>
          </div>
        </div>
        <div className="flex gap-8 justify-start items-center">
          <img src="/Redeem.svg" alt="" className="w-6 h-6 md:w-[2vw] md:h-[2vw]" />
          <div>
            <h2 className="text-sm text-gray-400 md:text-[1.2vw]">They get</h2>
            <h2 className="text-xs md:text-[1vw]">Discount coupon 10 points</h2>
          </div>
        </div>
      </div>
    </div>
  );
  const Redraw = () => (
    <div className="h-full md:min-h-[92vh] md:mt-5 md:overflow-auto no-scrollbar w-full px-8 bg-white rounded-2xl flex flex-col gap-6">
      <div className="flex items-center p-3 mt-4 flex-col">
        <p className="text-4xl">$10</p>
        <Button name="Redraw" />
      </div>
      <div>
        <div className="pb-3">
          <p className="text-xs ">Payment</p>
          <p className="text-xs text-gray-400">Recent transactions</p>
        </div>

        <div className="w-full overflow-hidden">
          <table className="w-full text-xs">
            <tbody>
              {paymentData.map((row, index) => (
                <tr
                  key={index}
                  className="text-xs flex items-center gap-2 py-1"
                >
                  <td className="text-gray-500">{row.date}</td>
                  <td className="text-gray-500">{row.points}</td>
                  <td className="ml-auto">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  const Apply = () => (
    <div className="h-full md:min-h-[92vh] md:mt-5 md:overflow-auto no-scrollbar w-full rounded-2xl flex flex-col gap-2">
      <div className="bg-white w-full shadom-sm h-56 rounded-2xl pt-8 p-5 flex flex-col justify-between items-start gap-8">
        <div className="flex gap-2 text-sm">
          <img src="/Redeem.svg" alt="" className="w-5 h-5" />
          <h2 className="inline">Apply Coupon</h2>
        </div>
        <div className="flex justify-between w-full text-xs text-gray-600">
          <h2>Get Cash equivalent</h2>
          <h2>$0</h2>
        </div>
        <div className="relative flex flex-row gap-3 justify-center items-center">
          <input type="text" className="bg-[#F9F9F9] p-3 rounded-lg w-full" placeholder="Add code here" />
          <button className="absolute right-1 top-1 bg-white rounded-lg px-3 py-2">Apply</button>
        </div>
      </div>
      <div className="w-full px-3 h-full bg-white shadom-sm rounded-2xl pt-4 pb-18">
        <div className="w-full h-full flex flex-col md:justify-center gap-2 md:py-8">
          <div className=" flex rounded-lg flex-col justify-between bg-[#F9F9F9] p-3">
            <h2 className="text-sm">Silver</h2>
            <h3 className="text-xs text-gray-500">10 points to silver</h3>
            <div className="relative bg-[#defeed] w-8/10 h-1 my-2">
              <div className="absolute left-0 w-9 h-1 bg-[var(--green)]"/>
            </div>
          </div>
          <div className=" flex flex-col rounded-lg justify-between bg-[#F9F9F9] p-3">
            <h2 className="text-sm">Gold</h2>
            <h3 className="text-xs text-gray-500">100,000 points to gold</h3>
            <div className="relative bg-[#defeed] w-8/10 h-1 my-2">
              <div className="absolute left-0 w-3 h-1 bg-[var(--green)]"/>
            </div>
          </div>
          <div className=" flex flex-col rounded-lg justify-between bg-[#F9F9F9] p-3">
            <h2 className="text-sm">Diamond</h2>
            <h3 className="text-xs text-gray-500">1,000,000 points to diamond</h3>
            <div className="relative bg-[#defeed] w-8/10 h-1 my-2">
              <div className="absolute left-0 w-36 h-1 bg-[var(--green)]"/>
            </div>
          </div>
          <h2 className="text-xs text-gray-500">
            Your earning levels also helps us to rank you.
          </h2>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen bg-[var(--background)] mb-5 relative">
      <div className="w-full sm:flex lg:grid lg:grid-cols-2 py-5 h-full overflow-hidden gap-4">
        <Refer />
        <div className="md:w-full md:overflow-auto no-scrollbar">
          <div className="hidden md:block md:min-h-[94vh]">
            {how ? <How /> : apply ? <Apply /> : redraw ? <Redraw /> : null}
            <div className="w-full h-17" />
          </div>
        </div>
      </div>

      {(how || apply || redraw) && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col md:hidden animate-fadeIn">
          
          <div className="flex items-center gap-3 p-4 border-b border-gray-200">
            <button
              onClick={() => {
                setHow(false);
                setApply(false);
                setRedraw(false);
              }}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <img src="/arrowleft.svg" alt="back" className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {how ? <How /> : apply ? <Apply /> : redraw ? <Redraw /> : null}
          </div>
        </div>
      )}

      <MenuButton />
    </div>
  );

};

export default ReferPage;