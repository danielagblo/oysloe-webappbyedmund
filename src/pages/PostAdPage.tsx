import MobileBanner from "../components/MobileBanner";
import ProfileStats from "../components/ProfileStats";
import MenuButton from "../components/MenuButton";
import PostAdForm from "../components/PostAdForm";

function PostAdPage() {
  return (
    <div className="flex flex-col no-scrollbar lg:flex-row w-full h-screen bg-[#ededed] text-[var(--dark-def)] overflow-hidden">
      <div className="lg:hidden w-full">
        <MobileBanner page="Post An Ad" />
      </div>

      <div className="hidden lg:flex w-[25vw] h-[100vh] items-center justify-center pl-2">
        <ProfileStats />
      </div>

      <div className="flex items-center justify-center no-scrollbar w-full lg:w-[75vw] lg:h-full max-md:-mt-5">
        <PostAdForm />
      </div>

      <MenuButton />
    </div>
  );
}

export default PostAdPage;
