import { useLatestPrivacyPolicy } from "../features/policy/usePolicy";

const PrivacyPage = () => {
  const { policy, isLoading, isError } = useLatestPrivacyPolicy();

  return (
    <div className="relative flex items-center justify-center w-screen sm:w-full h-full text-center">
      <div
        className={`
          shadow-lg rounded-2xl bg-white px-6 py-10 sm:px-5 sm:py-6 w-full 
          flex flex-col items-center justify-center sm:shadow-lg sm:rounded-2xl 
          h-screen sm:h-auto overflow-auto no-scrollbar
        `}
      >
        <div className="flex pt-5 px-5 flex-col justify-start gap-2 mb-2 w-full sm:h-[85vh]">
          <h3 className="text-2xl">{policy?.title ?? "Privacy Policy"}</h3>
          <p className="text-sm text-gray-500">{policy?.date ?? ""}</p>
          {isLoading && <p className="mt-4">Loading...</p>}
          {isError && (
            <p className="mt-4 text-red-500">Failed to load policy.</p>
          )}
          {!isLoading && policy && (
            <div
              className="prose max-w-none mt-4 text-sm text-left pb-20"
              dangerouslySetInnerHTML={{ __html: (policy.body).split('\n').join('<br/>') }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
