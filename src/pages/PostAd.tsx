import PageLocked from '../components/PageLocked'
import ProfileStats from '../components/ProfileStats'

function PostAd() {

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center w-full h-screen overflow-hidden -mt-3">
      <div className="flex-shrink-0 w-[25%] bg-[#f3f4f6]" style={{ padding:"1.5rem 1rem" }}>
        <ProfileStats />
      </div>
      <div className="flex-grow w-full h-full bg-[#f3f4f6]">
        <PageLocked page="Post Ad"/>
      </div>
    </div>
  )
}

export default PostAd
