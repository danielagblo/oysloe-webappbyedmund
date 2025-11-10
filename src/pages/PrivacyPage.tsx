const PrivacyPage = () => {
  return (
    <div className="flex justify-between h-screen w-full items-center gap-2">
      <div className="flex flex-col lg:flex-row w-full max-md:mt-20 max-md:ml-[-2.5rem] mr-2 h-full md:h-[95vh] justify-start gap-4">
        <div className="bg-white w-full lg:w-1/2 mt-2 flex flex-col justify-start items-center gap-4 px-3 py-3 rounded-2xl text-xs">
          <div className="flex pt-5 px-5 flex-col justify-start gap-2 mb-2">
            <h3 className=" text-2xl">Privacy Policy</h3>
            <h3 className="">Help us improve on our app</h3>
          </div>
        </div>
        <div className="bg-white w-full lg:w-1/2 mt-2 flex flex-col justify-start items-center gap-4 px-3 py-3 rounded-2xl text-xs max-lg:mb-20">
          <div className="flex pt-5 px-5 flex-col justify-start gap-2 mb-2"></div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
