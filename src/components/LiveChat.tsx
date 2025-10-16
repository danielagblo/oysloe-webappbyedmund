// // This component will probably be rewritten when we add functionality so here is a static, hard coded ver for now -N
// export default function LiveChat ()  {

//     const messages = [
//         <div className="flex justify-start" style={{ position:"relative", height:"6.5rem" }}>
//             <img src="kofi.jpg" alt="pfp" className="w-8 h-8 rounded-full object-cover z-10 mr-2 self-start" style={{ backgroundColor:"lightblue" }}/>
//             <div className="max-w-xs">
//                 <p className="font-semibold text-sm mb-1">Kofi</p>
//                 <div style={{ position:"absolute", left:"8px" }}>
//                     <div className="bg-gray-100 p-3 rounded-xl rounded-tl-none">
//                         <p className="text-sm">Hi,can i grab? your product.i need this item to buy</p>
//                     </div>
//                     <p className="text-xs text-gray-400 mt-1 text-right">12:00</p>
//                 </div>    
//             </div>
//         </div>,
//         <div className="flex justify-end" style={{ position:"relative", height:"6.5rem" }}>
//             <div className="max-w-xs">
//                 <p className="font-semibold text-sm mb-1 text-right">You</p>
//                 <div style={{ position:"absolute", right:"8px" }}>
//                     <div className="bg-[#e9fcef] text-black p-3 rounded-xl rounded-tr-none">
//                         <p className="text-sm">Hi,can i grab? your product.i need this item to buy</p>
//                     </div>
//                     <p className="text-xs text-gray-200 mt-1 text-left">12:00</p>
//                 </div>
//             </div>
//             <img src="your-avatar.jpg" alt="You" className="w-8 h-8 rounded-full object-cover ml-2 z-10 self-start" style={{ height:"2rem", width:"2rem", backgroundColor:"lightblue" }}/>
//         </div>,
//         <div className="flex justify-end" style={{ position:"relative", height:"6.5rem" }}>
//             <div className="max-w-xs">
//                 <p className="font-semibold text-sm mb-1 text-right">You</p>
//                 <div style={{ position:"absolute", right:"8px" }}>
//                     <div className="bg-[#e9fcef] text-black p-3 rounded-xl rounded-tr-none">
//                         <p className="text-sm">Hi,can i grab?</p>
//                     </div>
//                     <p className="text-xs text-gray-200 mt-1 text-left">12:00</p>
//                 </div>
//             </div>
//             <img src="your-avatar.jpg" alt="You" className="w-8 h-8 rounded-full object-cover ml-2 z-10 self-start"  style={{ height:"2rem", width:"2rem", backgroundColor:"lightblue" }}/>
//         </div>

//     ]

//     const ChatInput = () => (
//         <div className="border-gray-200 flex justify-center items-center absolute bottom-6 w-full">
//             <div className="flex flex-row justify-center items-center w-80%" style={{ border: "1px solid #00000030", borderRadius:"20px", padding:"0.5rem 1rem" }}>
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M24 19C24 19.553 23.552 20 23 20H20V23C20 23.553 19.552 24 19 24C18.448 24 18 23.553 18 23V20H15C14.448 20 14 19.553 14 19C14 18.447 14.448 18 15 18H18V15C18 14.447 18.448 14 19 14C19.552 14 20 14.447 20 15V18H23C23.552 18 24 18.447 24 19ZM16 7C16.551 7 17 6.552 17 6C17 5.448 16.551 5 16 5C15.449 5 15 5.448 15 6C15 6.552 15.449 7 16 7ZM4.808 9.151L0 13.959V5C0 2.243 2.243 0 5 0H17C19.757 0 22 2.243 22 5V12H19C17.415 12 16.115 13.235 16.008 14.793L10.366 9.151C8.833 7.618 6.34 7.618 4.808 9.151ZM13 6C13 7.654 14.346 9 16 9C17.654 9 19 7.654 19 6C19 4.346 17.654 3 16 3C14.346 3 13 4.346 13 6ZM12 19C12 17.537 13.052 16.316 14.44 16.053L8.952 10.565C8.2 9.814 6.976 9.813 6.222 10.565L0 16.787V17C0 19.757 2.243 22 5 22H12V19Z" fill="#374957"/>
//                 </svg>

//                 <input
//                     type="text"
//                     placeholder="   Type a message..."
//                     className="flex-1 border-0 focus:ring-0 text-gray-700"
//                 />
//                 <svg width="16" height="16" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M1.00391 9C1.65694 20.4026 16.1613 18.8902 16.1667 9.00827" stroke="#374957" strokeWidth="2"/>
//                     <rect x="4.66406" y="0.5" width="7" height="12" rx="3.5" fill="#374957" stroke="#374957"/>
//                     <rect x="7.66406" y="19.5" width="2" height="4" fill="#374957" stroke="#374957"/>
//                 </svg>
//             </div>
//         </div>
//     )
//     return (
//         <div className="col-span-12 lg:col-span-4 rounded-xl overflow-hidden shadow-lg border border-gray-100">        
//             <div className="bg-white h-full flex flex-col relative">
//                 <div className="flex-1 p-6 overflow-y-auto space-y-4">
//                     <p className="text-xs text-gray-400 text-center mb-6">Yesterday</p>

//                     {messages}

//                     <p className="text-xs text-gray-400 text-center my-6">Today</p>
//                 </div>
//                 <ChatInput />
//             </div>
//         </div>
//     )
// };

type LiveChatProps = {
  caseId: string | null;
  onClose: () => void;
};

export default function LiveChat({ caseId, onClose }: LiveChatProps) {
  if (!caseId) return null;

  const ChatInput = () => (
    <div className="border-gray-200 flex justify-center items-center absolute bottom-6 w-full">
      <div
        className="flex items-center w-[90%] border border-gray-300 rounded-full px-4 py-2 bg-white"
      >
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border-0 focus:ring-0 text-gray-700 bg-transparent"
        />
        <button className="text-green-600 font-semibold">Send</button>
      </div>
    </div>
  );

  return (
    <div className="col-span-12 lg:col-span-4 rounded-xl overflow-hidden shadow-lg border border-gray-100">
      <div className="bg-white h-full flex flex-col relative">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h2 className="font-semibold text-lg">Case #{caseId}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <p className="text-xs text-gray-400 text-center mb-6">Yesterday</p>
          {/* Hardcoded messages for now */}
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-xl rounded-tl-none">
              <p className="text-sm">Hi, can I grab your product?</p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-green-100 text-black p-3 rounded-xl rounded-tr-none">
              <p className="text-sm">Sure! Which one?</p>
            </div>
          </div>
        </div>

        <ChatInput />
      </div>
    </div>
  );
}
