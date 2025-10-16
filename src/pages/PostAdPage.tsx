import PageLocked from '../components/PageLocked'
import ProfileStats from '../components/ProfileStats'

function PostAdPage() {
  return (
    <div className="flex flex-col lg:flex-row w-full h-screen bg-[#f3f4f6] -mt-3 overflow-hidden">

      <div className="w-full lg:w-[25%] p-2.5 mt-1 flex-shrink-0 overflow-y-auto">
        <ProfileStats />
      </div>

      <div className="flex items-center justify-center w-full lg:flex-grow p-4">
        <PageLocked page="Post Ad" />
      </div>
    </div>
  )
}

export default PostAdPage
