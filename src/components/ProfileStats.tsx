export default function ProfileStats () {

    const Profile = () => (
        <div className="flex flex-col items-center pb-6 border-b border-gray-100">
            <img
                src="avatar.jpg" // Placeholder for the avatar image
                alt="pfp"
                className="w-24 h-24 rounded-full object-cover mb-4"
                style={{ height:"3rem", width:"3rem", backgroundColor:"pink" }}
            />
            <h2 className="text-xl font-semibold mb-1">Alexander Kowri</h2>
            <span className="text-xs text-green-500 font-medium bg-green-500/10 px-2 py-0.5 rounded">High Level</span>
        </div>
    )

    const AdStats = () => (
        <div style={{ display:"flex", gap:"1rem", width:"100%", justifyContent:"center", alignContent:"center", fontSize:"80%" }}>
            <div className="text-center" style={{ width:"100%", backgroundColor:"#EDEDED", padding:"0.2rem", borderRadius:"8px" }}>
                <p className="font-bold">900k</p>
                <p className="text-sm text-gray-500" style={{fontSize:"80%"}}>Active Ads</p>
            </div>
            <div className="text-center" style={{ width:"100%", backgroundColor:"#EDEDED", padding:"0.2rem", borderRadius:"8px" }}>
                <p className="font-bold">900k</p>
                <p className="text-sm text-gray-500" style={{fontSize:"80%"}}>Sold Ads</p>
            </div>
        </div>
    )

    const RatingReviews = () => (
        <div className="flex-grow" style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
            <h3 className="text-5xl font-extrabold mb-1">4.5</h3>
            <p>★  ★  ★  ★  <span style={{color:"gray"}}>★</span></p>
            <p className="text-lg text-gray-600 mb-6">234 Reviews</p>
            <div style={{fontSize:"80%", width:"100%"}}>
                {[5, 5, 5, 5, 1].map((stars, index) => (
                    <div key={index} className="flex items-center mb-1" style={{ width: '100%' }}>
                        <span className="text-black w-8 text-sm">★ {stars}</span>
                            <div className="flex-1 h-1.25 bg-gray-200 rounded mx-2">
                                <div className="h-full bg-black rounded" style={{ width: '40%' }}></div>
                            </div>
                        <span className="text-sm text-gray-500 w-8" style={{fontSize:"80%"}}>50%</span>
                    </div>
                ))}
            </div>
        </div>
    )

    return (
      <div className="col-span-12 lg:col-span-3 rounded-xl z">
        <div className="flex flex-col" style={{gap:"0.5rem"}}>
            <div className="shadow-sm" style={{ padding: "2rem 1.5rem", borderRadius:"12px", backgroundColor:"#ffffff" }}>
                <Profile />
                <AdStats />
            </div>
            <div className="shadow-sm" style={{ padding: "1rem 2rem", borderRadius:"12px", backgroundColor:"#ffffff" }}>
                <RatingReviews />
            </div>
        </div>
      </div>
    )
};
