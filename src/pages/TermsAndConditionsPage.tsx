import { useLatestTermsAndConditions } from "../features/policy/usePolicy";

function TermsAndConditionsPage() {
  const { policy, isLoading, isError } = useLatestTermsAndConditions();

  return (
    <div className="relative flex items-center justify-center w-screen sm:w-full h-full text-center">
      <div
        className={`
          shadow-lg rounded-2xl bg-white lg:h-[93vh] px-6 py-10 sm:px-5 max-lg:pt-0 sm:py-6 w-full 
          flex flex-col items-center justify-center sm:shadow-lg sm:rounded-2xl 
          h-screen sm:h-auto overflow-auto no-scrollbar
        `}
      >
        <div className="flex lg:pt-15 px-5 flex-col justify-start gap-2 mb-2 w-full sm:h-[85vh] overflow-auto no-scrollbar">
          <h3 className="text-2xl max-lg:pt-15">
            {policy?.title ?? "Terms & Conditions"}
          </h3>
          <p className="text-sm text-gray-500">{policy?.date ?? ""}</p>
          {isLoading && <p className="mt-4">Loading...</p>}
          {isError && (
            <p className="mt-4 text-red-500">Failed to load terms.</p>
          )}
          {!isLoading && policy && (
            <div
              className="prose max-w-none mt-4 pb-20 text-sm text-left"
              dangerouslySetInnerHTML={{
                __html: policy.body.split("\n").join("<br/><br/>"),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditionsPage;
