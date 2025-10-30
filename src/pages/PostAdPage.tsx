import MobileBanner from "../components/MobileBanner";
import PageLocked from "../components/PageLocked";
import ProfileStats from "../components/ProfileStats";
import MenuButton from "../components/MenuButton";

function PostAdPage() {
  return (
    <div className="flex flex-col lg:flex-row w-full h-screen bg-[var(--div-active)] text-[var(--dark-def)] overflow-hidden">
      <div className="sm:hidden w-full">
        <MobileBanner backto="Home" page="Post An Ad" />
      </div>

      <div className="hidden sm:flex w-[25vw] h-[100vh] items-center justify-center pl-2">
        <ProfileStats />
      </div>

      <div className="flex items-center justify-center w-full lg:flex-grow p-4">
        <PageLocked page="Post Ad" />
      </div>

      <MenuButton />
    </div>
  );
}

export default PostAdPage;
