import MenuButton from "../components/MenuButton";
import ProfileSidebar from "../components/ProfileSidebar";
import ProfileStats from "../components/ProfileStats";

const TermsAndConditionsPage = () => {
  return (
    <div className="flex justify-between h-screen w-screen items-center bg-[#f3f4f6] gap-4">
      <div className="w-1/11 h-full">
        <ProfileSidebar active="terms" onSelect={() => {}} />
      </div>
      <div className="flex flex-col lg:flex-row w-full p-3 max-md:ml-[-2.5rem] mr-2 h-full  justify-start gap-4">
        <div className="bg-white w-full lg:w-1/2 mt-2 flex flex-col justify-start items-center gap-4 px-3 py-3 rounded-2xl text-xs">
          <div className="flex pt-5 px-5 flex-col justify-start gap-2 mb-2">
            <h3 className=" text-2xl">T&C</h3>
            <h3 className="">Help us improve on our app</h3>
          </div>
        </div>
        <div className="bg-white w-full lg:w-1/2 mt-2 flex flex-col justify-start items-center gap-4 px-3 py-3 rounded-2xl text-xs max-lg:mb-20">
          <div className="flex pt-5 px-5 flex-col justify-start gap-2 mb-2"></div>
        </div>
      </div>
      <div className="hidden sm:flex w-[20vw] h-[100vh] items-center justify-center mr-6">
        <ProfileStats />
      </div>
      <MenuButton />
    </div>
  );
};

export default TermsAndConditionsPage;
