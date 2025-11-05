function TermsAndConditionsPage() {
  return (
    <div className="relative flex items-center justify-center w-[100vw] sm:w-full h-full text-center">
      <div
        className={`
          shadow-lg rounded-2xl bg-white px-6 py-10 sm:px-5 sm:py-6 w-full 
          flex flex-col items-center justify-center sm:shadow-lg sm:rounded-2xl 
          h-[100vh] sm:h-auto
        `}
      >
        <div className="flex pt-5 px-5 flex-col justify-start gap-2 mb-2 w-full sm:h-[85vh]">
          <h3 className="text-2xl">Terms & Conditions</h3>
          <h3>Help us improve on our app</h3>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditionsPage;
