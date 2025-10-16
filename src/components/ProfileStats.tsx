// // export default function ProfileStats () {

// //     const Profile = () => (
// //         <div className="flex flex-col items-center pb-6 border-b border-gray-100">
// //             <img
// //                 src="avatar.jpg" // Placeholder for the avatar image
// //                 alt="pfp"
// //                 className="w-24 h-24 rounded-full object-cover mb-4"
// //                 style={{ height:"3rem", width:"3rem", backgroundColor:"pink" }}
// //             />
// //             <h2 className="text-xl font-semibold mb-1">Alexander Kowri</h2>
// //             <span className="text-xs text-green-500 font-medium bg-green-500/10 px-2 py-0.5 rounded">High Level</span>
// //         </div>
// //     )

// //     const AdStats = () => (
// //         <div style={{ display:"flex", gap:"1rem", width:"100%", justifyContent:"center", alignContent:"center", fontSize:"80%" }}>
// //             <div className="text-center" style={{ width:"100%", backgroundColor:"#EDEDED", padding:"0.2rem", borderRadius:"8px" }}>
// //                 <p className="font-bold">900k</p>
// //                 <p className="text-sm text-gray-500" style={{fontSize:"80%"}}>Active Ads</p>
// //             </div>
// //             <div className="text-center" style={{ width:"100%", backgroundColor:"#EDEDED", padding:"0.2rem", borderRadius:"8px" }}>
// //                 <p className="font-bold">900k</p>
// //                 <p className="text-sm text-gray-500" style={{fontSize:"80%"}}>Sold Ads</p>
// //             </div>
// //         </div>
// //     )

// //     const RatingReviews = () => (
// //         <div className="flex-grow" style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
// //             <h3 className="text-5xl font-extrabold mb-1">4.5</h3>
// //             <p>★  ★  ★  ★  <span style={{color:"gray"}}>★</span></p>
// //             <p className="text-lg text-gray-600 mb-6">234 Reviews</p>
// //             <div style={{fontSize:"80%", width:"100%"}}>
// //                 {[5, 5, 5, 5, 1].map((stars, index) => (
// //                     <div key={index} className="flex items-center mb-1" style={{ width: '100%' }}>
// //                         <span className="text-black w-8 text-sm">★ {stars}</span>
// //                             <div className="flex-1 h-1.25 bg-gray-200 rounded mx-2">
// //                                 <div className="h-full bg-black rounded" style={{ width: '40%' }}></div>
// //                             </div>
// //                         <span className="text-sm text-gray-500 w-8" style={{fontSize:"80%"}}>50%</span>
// //                     </div>
// //                 ))}
// //             </div>
// //         </div>
// //     )

// //     return (
// //       <div className="col-span-12 lg:col-span-3 rounded-xl z">
// //         <div className="flex flex-col" style={{gap:"0.5rem"}}>
// //             <div className="shadow-sm" style={{ padding: "2rem 1.5rem", borderRadius:"12px", backgroundColor:"#ffffff" }}>
// //                 <Profile />
// //                 <AdStats />
// //             </div>
// //             <div className="shadow-sm" style={{ padding: "1rem 2rem", borderRadius:"12px", backgroundColor:"#ffffff" }}>
// //                 <RatingReviews />
// //             </div>
// //         </div>
// //       </div>
// //     )
// // };







// import { useState } from "react";


// export default function ProfileStats() {
//   const [isExpanded, setIsExpanded] = useState(false);

//   // --- Small Components ---
//   const Profile = () => (
//     <div className="flex flex-col items-center pb-6 border-b border-gray-100">
//       <img
//         src="avatar.jpg"
//         alt="pfp"
//         className="w-24 h-24 rounded-full object-cover mb-4 bg-pink-300"
//         style={{ height: "3rem", width: "3rem" }}
//       />
//       <h2 className="text-xl font-semibold mb-1">Alexander Kowri</h2>
//       <span className="text-xs text-green-500 font-medium bg-green-500/10 px-2 py-0.5 rounded">
//         High Level
//       </span>
//     </div>
//   );

//   const AdStats = () => (
//     <div className="flex gap-4 justify-center w-full text-sm">
//       <div className="text-center bg-gray-100 p-2 rounded-lg flex-1">
//         <p className="font-bold">900k</p>
//         <p className="text-gray-500 text-xs">Active Ads</p>
//       </div>
//       <div className="text-center bg-gray-100 p-2 rounded-lg flex-1">
//         <p className="font-bold">900k</p>
//         <p className="text-gray-500 text-xs">Sold Ads</p>
//       </div>
//     </div>
//   );

//   const RatingReviews = () => (
//     <div className="flex flex-col items-center justify-center">
//       <h3 className="text-5xl font-extrabold mb-1">4.5</h3>
//       <p>★ ★ ★ ★ <span className="text-gray-400">★</span></p>
//       <p className="text-lg text-gray-600 mb-6">234 Reviews</p>

//       <div className="w-full text-xs space-y-1">
//         {[5, 5, 5, 5, 1].map((stars, index) => (
//           <div key={index} className="flex items-center">
//             <span className="w-8">★ {stars}</span>
//             <div className="flex-1 h-1.5 bg-gray-200 rounded mx-2">
//               <div className="h-full bg-black rounded" style={{ width: "40%" }}></div>
//             </div>
//             <span className="w-8 text-gray-500 text-right">50%</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   // --- Compact Banner (Mobile View) ---
//   const MobileBanner = () => (
//     <button
//       onClick={() => setIsExpanded(!isExpanded)}
//       className="w-full flex items-center justify-between bg-white shadow-sm rounded-none lg:rounded-xl px-4 py-3 active:scale-[0.99] transition lg:hidden fixed top-0 left-0 z-20"
//     >
//       <div className="flex items-center gap-3">
//         <img
//           src="avatar.jpg"
//           alt="pfp"
//           className="w-10 h-10 rounded-full object-cover bg-pink-300"
//         />
//         <div className="flex flex-col text-left">
//           <span className="font-semibold text-base leading-tight">Alexander Kowri</span>
//           <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded w-fit">
//             High Level
//           </span>
//         </div>
//       </div>
//       <span className="text-lg font-bold text-gray-700">4.5★</span>
//     </button>
//   );

//   // --- Main Layout ---
//   return (
//     <div className="col-span-12 lg:col-span-3 w-full relative">
//       {/* Mobile banner always visible on small screens */}
//       {isExpanded ? 
//         <button
//         onClick={() => setIsExpanded(!isExpanded)}
//         className="w-full flex items-center justify-between bg-white shadow-sm rounded-none lg:rounded-xl px-4 py-3 active:scale-[0.99] transition lg:hidden fixed top-0 left-0 z-20"
//         >
//             <div className='fas fa-angle-up' />
//             <FaAngleUp />
//         </button> : 
//         <MobileBanner />}
//       {/* <MobileBanner /> */}

//       {/* Spacer to prevent overlap when banner is fixed */}
//       <div className="h-[3.75rem] lg:hidden" />

//       {/* Full stats only visible on desktop/tablet or when expanded */}
//       <div
//         className={`flex flex-col gap-3 mt-3 transition-all duration-300 ${
//           isExpanded ? "block" : "hidden"
//         } lg:block`}
//       >
//         <div className="shadow-sm p-6 rounded-xl bg-white">
//           <Profile />
//           <AdStats />
//         </div>
//         <div className="shadow-sm p-6 rounded-xl bg-white">
//           <RatingReviews />
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { FaAngleUp } from "react-icons/fa";

export default function ProfileStats() {
  const [isExpanded, setIsExpanded] = useState(false);

  // --- Small Components ---
  const Profile = () => (
    <div className="flex flex-col items-center pb-6 border-b border-gray-100">
      <img
        src="avatar.jpg"
        alt="pfp"
        className="w-24 h-24 rounded-full object-cover mb-4 bg-pink-300"
        style={{ height: "3rem", width: "3rem" }}
      />
      <h2 className="text-xl font-semibold mb-1">Alexander Kowri</h2>
      <span className="text-xs text-green-500 font-medium bg-green-500/10 px-2 py-0.5 rounded">
        High Level
      </span>
    </div>
  );

  const AdStats = () => (
    <div className="flex gap-4 justify-center w-full text-sm">
      <div className="text-center bg-gray-100 p-2 rounded-lg flex-1">
        <p className="font-bold">900k</p>
        <p className="text-gray-500 text-xs">Active Ads</p>
      </div>
      <div className="text-center bg-gray-100 p-2 rounded-lg flex-1">
        <p className="font-bold">900k</p>
        <p className="text-gray-500 text-xs">Sold Ads</p>
      </div>
    </div>
  );

  const RatingReviews = () => (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-5xl font-extrabold mb-1">4.5</h3>
      <p>★ ★ ★ ★ <span className="text-gray-400">★</span></p>
      <p className="text-lg text-gray-600 mb-6">234 Reviews</p>
    </div>
  );

  // --- Compact Banner (Mobile View) ---
  const MobileBanner = () => (
    <button
      onClick={() => setIsExpanded(true)}
      className="w-full flex items-center justify-between bg-white shadow-sm rounded-none lg:rounded-xl px-4 py-3 active:scale-[0.99] transition lg:hidden fixed top-0 left-0 z-20"
    >
      <div className="flex items-center gap-3">
        <img
          src="avatar.jpg"
          alt="pfp"
          className="w-10 h-10 rounded-full object-cover bg-pink-300"
        />
        <div className="flex flex-col text-left">
          <span className="font-semibold text-base leading-tight">Alexander Kowri</span>
          <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded w-fit">
            High Level
          </span>
        </div>
      </div>
      <span className="text-lg font-bold text-gray-700">4.5★</span>
    </button>
  );

  // --- Collapse Bar ---
  const CollapseBar = () => (
    <button
      onClick={() => setIsExpanded(false)}
      className="w-full flex items-center justify-center bg-white shadow-sm px-4 py-2 lg:hidden fixed top-0 left-0 z-30 border-b border-gray-200"
    >
      <FaAngleUp className="text-xl text-gray-600" />
    </button>
  );

  // --- Main Layout ---
  return (
    <div className="col-span-12 lg:col-span-3 w-full relative">
      {/* Mobile top banner or collapse bar */}
      {isExpanded ? <CollapseBar /> : <MobileBanner />}

      {/* Spacer to prevent overlap when banner is fixed */}
      <div className="h-[3.5rem] lg:hidden" />

      {/* Full stats visible when expanded or on large screens */}
      <div
        className={`flex flex-col gap-3 transition-all duration-300 ${
          isExpanded ? "block mt-0" : "hidden"
        } lg:block`}
      >
        <div className="shadow-sm p-6 rounded-xl bg-white">
          <Profile />
          <AdStats />
        </div>
        <div className="shadow-sm p-6 rounded-xl bg-white">
          <RatingReviews />
        </div>
      </div>
    </div>
  );
}
