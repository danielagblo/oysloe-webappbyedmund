import MenuButton from "../components/MenuButton";
import MobileBanner from "../components/MobileBanner";
import PostAdForm from "../components/PostAdForm";
import ProfileStats from "../components/ProfileStats";
import RequireAuth from "../components/RequireAuth";
import { useRef } from "react";

function PostAdPage() {
  const onMobileBackClick = useRef<(() => void) | null>(null);

  const handleMobileBack = () => {
    if (onMobileBackClick.current) {
      onMobileBackClick.current();
    }
  };

  return (
    <div className="flex flex-col no-scrollbar items-center justify-center lg:flex-row w-full h-screen bg-[#ededed] max-md:bg-white text-[var(--dark-def)] overflow-hidden">
      <div className="lg:hidden w-full">
        <MobileBanner page="Post An Ad" onBackClick={handleMobileBack} />
      </div>

      <div className="hidden lg:flex w-[25vw] h-screen items-center justify-center pl-2">
        <ProfileStats />
      </div>

      <div className="flex items-center max-lg:bg-(--div-active) justify-center no-scrollbar lg:h-[93vh] w-full lg:w-[75vw]">
        <RequireAuth>
          <PostAdForm mobileBackRef={onMobileBackClick} />
        </RequireAuth>
      </div>

      <MenuButton />
    </div>
  );
}

export default PostAdPage;
