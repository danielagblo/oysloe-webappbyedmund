import { useNavigate } from "react-router-dom";

export const ResetDropdown = ({ page = "default" }: { page?: string }) => {
  const navigate = useNavigate();

  return (
    <div>
      {page === "email-reset" ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/login");
          }}
          className="px-5 py-3 w-full bg-[#F9F9F9] font-medium text-(--dark-def) max-sm:bg-white max-sm:h-[47px] max-sm:w-[132px] rounded-full text-[12px] sm:text-xs hover:bg-gray-100 transition cursor-pointer"
        >
          Login
        </button>
      ) : page === "phone-reset" ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/login");
          }}
          className="px-5 py-3 w-full bg-[#F9F9F9] text-(--dark-def) max-sm:bg-white max-sm:h-[47px] max-sm:w-[132px] rounded-full text-[12px] sm:text-xs hover:bg-gray-100 transition cursor-pointer"
        >
          Login
        </button>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/reset-password/phone");
          }}
          className="px-5 py-3 w-full bg-[#F9F9F9] text-(--dark-def) max-sm:bg-white max-sm:h-[47px] max-sm:w-[132px] rounded-full text-[12px] sm:text-xs hover:bg-gray-100 transition cursor-pointer"
        >
          Reset Password
        </button>
      )}
    </div>
  );
};
