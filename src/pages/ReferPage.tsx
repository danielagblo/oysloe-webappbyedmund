import { useState } from "react";
import "../App.css";
import Button from "../components/Button";
import MenuButton from "../components/MenuButton";
const ReferPage = () => {
  const [how, setHow] = useState(true);
  const [redraw, setRedraw] = useState(false);
  const [apply, setApply] = useState(false);

  const paymentData = [
    { date: "Apr 7, 2024", points: "20 points", total: "$430" },
    { date: "Apr 8, 2024", points: "10 points", total: "$440" },
    { date: "Apr 9, 2024", points: "30 points", total: "$470" },
    { date: "Apr 10, 2024", points: "15 points", total: "$485" },
    { date: "Apr 11, 2024", points: "25 points", total: "$510" },
  ];


  const Refer = () => (
    <div className="h-full w-full flex flex-col gap-2">
      <div className="bg-white w-full h-20 rounded-2xl p-5 flex justify-between items-center shadow-sm">
        <div className="flex gap-2 my-2">
          <img src="/star green.svg" alt="" className="w-4 h-4 my-auto" />
          <h2 className="text-sm">Points</h2>
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
            <img src="/arrowright.svg" alt="" />
          </div>
          <span className="-m-3 pt-1 pl-4 text-xs text-gray-400">equals &#8804;10</span>
        </div>
      </div>
      <div className="flex gap-4 w-full">
        <div className="bg-white w-full h-20 rounded-2xl p-3 flex justify-between items-center gap-2 shadow-sm">
          <div className="flex flex-col items-center justify-between gap-2">
            <img src="/earn.svg" className="w-5 h-5" alt="" />
            <span className="text-sm">Earn</span>
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
            <img src="/Redeem.svg" className="w-5 h-5" alt="" />
            <span className="text-sm">Redeem</span>
          </div>
          <img src="/arrowright.svg" alt="" />
        </div>
      </div>
      <div
        className="bg-white shadom-sm w-full h-24 pt-6 rounded-2xl p-2 flex justify-between items-center"
        onClick={() => {
          setRedraw(false);
          setHow(false);
          setApply(true);
        }}
      >
        <div className="flex flex-col justify-between w-full">
          <h2 className="text-sm">Gold (Level)</h2>
          <h3 className="text-xs text-gray-400">9,000 points to diamond</h3>
          <div className="relative bg-[#defeed] w-8/10 h-1 my-2">
            <div className="absolute left-0 w-9 h-1 bg-[var(--green)]"/>
          </div>
        </div>
        <img className="mb-9" src="/arrowright.svg" alt="" />
      </div>
      <div className="bg-white w-full h-full shadom-sm rounded-2xl p-3 flex flex-col justify-between items-start px-4 pt-6 pb-18">
        <div className="w-full flex flex-col justify-center gap-2">
          <h2 className="text-sm 2xl:text-xl">Refer Your friends and Earn</h2>
          <span>
            <img src="/ok.svg" alt="" className="inline" />
            <h2 className="text-xs inline pl-3 text-gray-400">Pro Partnership status</h2>
          </span>
          <span>
            <img src="/ok.svg" alt="" className="inline" />
            <h2 className="text-xs inline pl-3 text-gray-400">
              All Ads stays promoted for a month
            </h2>
          </span>
          <span>
            <img src="/ok.svg" alt="" className="inline" />
            <h2 className="text-xs inline pl-3 text-gray-400">
              Share unlimited number of Ads
            </h2>
          </span>
          <span>
            <img src="/ok.svg" alt="" className="inline" />
            <h2 className="text-xs inline pl-3 text-gray-400">Boost your business</h2>
          </span>
        </div>
        <div className="mt-5 w-full">
          <h2 className="text-xs text-gray-400">You've referred 0 friends</h2>
          <div className="flex gap-2 items-center justify-between w-full">
            <div className="py-2 rounded-lg mt-3 relative flex flex-row gap-3 justify-center border border-[var(--div-border)] items-center w-full">
              <input
              type="text"
              value="DAN2785"
              readOnly
              className="py-1 focus:border-none rounded text-md"
              />
              <button 
                className="absolute right-1 top-1 hover:text-gray-500 hover:cursor-pointer bg-[var(--div-active)] rounded-lg px-3 py-2"
                onClick={() => navigator.clipboard.writeText("DAN2785")}
              >Copy</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const How = () => (
    <div className="h-fit w-full px-8 py-9 bg-white rounded-2xl flex flex-col gap-1 items-start">
      <div>
        <h2 className="text-sm">We value friendship</h2>
        <h2 className="text-xs text-gray-400">Follow the steps below and get rewarded</h2>
      </div>
      <div 
        className="w-full flex -ml-13 justify-start gap-4" 
        style={{ transform:"scale(0.7)" }}>
        <img src="/steps.svg" alt="" className="w-10 h-auto ml-5" />
        <div className="flex flex-col justify-evenly gap-6 mb-0">
          <div>
            <h2 className="text-xs inline text-gray-600">Share your code</h2>
            <img 
              src="/copy.svg" 
              className="inline w-3 h-auto" 
              alt=""
            />
          </div>
          <h2 className="text-xs text-gray-600">Your friend adds the code</h2>
          <h2 className="text-xs text-gray-600">Your friend places an order</h2>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-8 justify-start items-center">
          <img src="/earn.svg" alt="" className="w-6 h-6" />
          <div>
            <h2 className="text-sm text-gray-400">You get</h2>
            <h2 className="text-xs">50 Points</h2>
          </div>
        </div>
        <div className="flex gap-8 justify-start items-center">
          <img src="/Redeem.svg" alt="" className="w-6 h-" />
          <div>
            <h2 className="text-sm text-gray-400">They get</h2>
            <h2 className="text-xs">Discount coupon 10 points</h2>
          </div>
        </div>
      </div>
    </div>
  );
  const Redraw = () => (
    <div className="h-full w-full px-8 bg-white rounded-2xl flex flex-col gap-6">
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
    <div className="h-full w-full rounded-2xl flex flex-col gap-2">
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
        <div className="w-full h-full flex flex-col justify-center gap-2 py-8">
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
    <div className="h-screen w-screen bg-[var(--background)] mb-5">
      <div className="w-full sm:flex lg:grid lg:grid-cols-2 py-5 h-full overflow-auto no-scrollbar gap-4">
        <Refer />
        {how ? <How /> : apply ? <Apply /> : redraw ? <Redraw /> : null}
      </div>
      <MenuButton />
    </div>
  );
};

export default ReferPage;
