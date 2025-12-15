import { useQuery } from "@tanstack/react-query";
import type { FormEvent, FormEventHandler } from "react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Button from "../components/Button";
import OnboardingScreen from "../components/OnboardingScreen";
import OTPLogin from "../components/OTPLogin";
import PhoneInput from "../components/PhoneInput";
import { ResetDropdown } from "../components/ResetDropdown";
import { useRegister } from "../features/Auth/useAuth";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import { apiClient } from "../services/apiClient";
import { endpoints } from "../services/endpoints";
import type { RegisterRequest } from "../types/Auth";

const SignInPage = () => {
  const isSmall = useIsSmallScreen();
  const shouldShowOnboarding =
    typeof window !== "undefined"
      ? localStorage.getItem("oysloe_onboarding_seen") !== "true"
      : true;
  const navigate = useNavigate();

  const [formData, setFormData] = useState<
    RegisterRequest & {
      confirmPassword: string;
      agreedToPrivacy: boolean;
      agreedToTerms: boolean;
    }
  >({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    referral_code: "",
    confirmPassword: "",
    agreedToPrivacy: false,
    agreedToTerms: false,
  });

  // modal state for showing privacy policy / terms as a bottom sheet
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [policyModalType, setPolicyModalType] = useState<
    "privacy" | "terms" | null
  >(null);
  // track whether user scrolled to end of policy content in modal
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Preload and cache latest policies using react-query (tanstack)
  const privacyQuery = useQuery({
    queryKey: ["policies", "privacyLatest"],
    queryFn: () => apiClient.get(endpoints.policies.privacyLatest()),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 6, // 6 hours
    refetchOnWindowFocus: false,
  });

  const termsQuery = useQuery({
    queryKey: ["policies", "termsLatest"],
    queryFn: () => apiClient.get(endpoints.policies.termsLatest()),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
    refetchOnWindowFocus: false,
  });

  const registerMutation = useRegister();

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = value;
    if (name === "phone") {
      newValue = newValue.replace(/[^\d+]/g, "");

      if (newValue.indexOf("+") > 0) {
        newValue = newValue.replace(/\+/g, "");
      }

      if (newValue.startsWith("+233") && newValue.length > 13)
        newValue = newValue.slice(0, 13);
      else if (!newValue.startsWith("+") && newValue.length > 12)
        newValue = newValue.slice(0, 12);
      if (newValue.startsWith("0") && newValue.length > 10)
        newValue = newValue.slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : newValue,
    }));
  };

  const handleSubmit: FormEventHandler = async (e: FormEvent) => {
    console.log("Form Submitted");
    e.preventDefault();

    const data = formData;

    // Name validation
    if (!data.name?.trim()) {
      console.log("Name is required");
      toast.error("Name is required");
      return;
    }

    // Email validation (basic check)
    if (!data.email?.trim()) {
      console.log("Email is required");
      toast.error("Email is required");
      return;
    }

    // Terms & conditions: require both privacy and terms to be accepted
    if (!(data.agreedToPrivacy && data.agreedToTerms)) {
      console.log(
        "You must agree to the Privacy Policy and Terms & Conditions",
      );
      toast.error(
        "You must agree to the Privacy Policy and Terms & Conditions",
      );
      return;
    }

    // Password validation
    if (!data.password || data.password.length < 6) {
      console.log("Password must be at least 6 characters long");
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (data.password !== data.confirmPassword) {
      console.log("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    // Phone validation & sanitization
    const phoneVal = data.phone.replace(/[^\d+]/g, "");

    // Phone validation (trust sanitization)
    if (!data.phone || data.phone.length === 0) {
      console.log("Phone number is required");
      toast.error("Phone number is required");
      return;
    }

    try {
      console.log("Redirecting to referral verification...");
      const registerData: RegisterRequest = {
        email: phoneVal === data.phone ? data.email : data.email,
        phone: phoneVal,
        password: data.password,
        name: data.name || "",
        address: data.address || "",
        referral_code: data.referral_code || "",
      };

      // Navigate to the referral verification page first and pass the
      // registration payload in location state so the verification page
      // can handle verification and then submit the registration.
      navigate("/referal-verification", { state: { registerData } });
      return;
    } catch (err) {
      console.log("could not navigate to referral verification");
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Navigation failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  // Reset scroll/read state when modal opens
  useEffect(() => {
    if (policyModalOpen) {
      setHasScrolledToEnd(false);
      // reset scroll position
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }
  }, [policyModalOpen, policyModalType]);

  return (
    <div className="lg:max-h-screen max-sm:text-(--dark-def) max-sm:bg-(--bg) no-scrollbar lg:overflow-hidden h-screen w-screen flex items-center max-sm:items-start justify-center max-sm:justify-center relative">
      <div className="flex flex-col items-center justify-center sm:w-full m-8 max-sm:m-0 lg:mb-0 overflow-auto no-scrollbar h-full py-20 lg:pt-10 lg:pb-7 max-sm:pb-24">
        <div className="flex flex-col gap-5 items-center justify-center">
          <div>
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.setItem("oysloe_guest", "true");
                } catch {
                  /*ignore*/
                }
                navigate("/");
              }}
              className="text-sm text-gray-500 max-lg:-mb-5 lg:mt-17.5 bg-(--div-active) rounded-full flex items-center gap-1 pl-3 px-2 py-1 hover:bg-gray-200 transition max-sm:fixed max-sm:top-4 max-sm:right-4 max-sm:bg-transparent max-sm:hover:bg-transparent"
            >
              Skip &nbsp;
              <img src="skip.svg" alt=">" className="inline h-4 w-4" />
            </button>
          </div>
          <h2 className="text-2xl max-sm:text-black max-sm:text-[28px]">
            Get
            <span className="max-sm:hidden">ting</span> started
          </h2>
          <form className="relative max-sm:space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center gap-3 max-sm:gap-2 max-sm:m-0">
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  autoComplete="name"
                  className="max-sm:border-gray-300 max-sm:text-[16px] max-sm:pl-12 max-sm:bg-white max-sm:h-[60px] max-sm:w-[85vw] max-sm:rounded-2xl border-gray-100 border-2 px-8 py-2 w-full rounded-lg focus:border-gray-400  outline-0"
                />
                <img
                  src="/name.svg"
                  alt="Name"
                  className="absolute left-2  max-sm:h-6 max-sm:left-4 max-sm:top-5 max-sm:text-[16px] max-sm:w-6 top-3 h-5 w-5"
                />
              </div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                  required
                  className="max-sm:border-gray-300 max-sm:text-[16px] max-sm:pl-12 max-sm:bg-white max-sm:h-[60px] max-sm:w-[85vw] max-sm:rounded-2xl border-gray-100 border-2 px-8 py-2 w-full rounded-lg focus:border-gray-400  outline-0"
                />
                <img
                  src="/email.svg"
                  alt="Email"
                  className="absolute  max-sm:h-6 max-sm:left-4 max-sm:top-5 max-sm:text-[16px] max-sm:w-6 left-2 top-3 h-5 w-5"
                />
              </div>
              <div className="relative">
                <PhoneInput
                  name="phone"
                  phone={formData.phone}
                  onChange={handleInputChange}
                  className="max-sm:border-gray-300 max-sm:text-[16px] max-sm:pl-12 max-sm:bg-white max-sm:h-[60px] max-sm:w-[85vw] max-sm:rounded-2xl border-gray-100 border-2 px-8 py-2 w-full rounded-lg focus:border-gray-400  outline-0"
                  required
                />
                <img
                  src="/phone.svg"
                  alt="Phone"
                  className="absolute left-2 max-sm:h-6 max-sm:left-4 max-sm:top-5 max-sm:text-[16px] max-sm:w-6 top-3 h-5 w-5"
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="max-sm:border-gray-300 max-sm:text-[16px] max-sm:pl-12 max-sm:bg-white max-sm:h-[60px] max-sm:w-[85vw] max-sm:rounded-2xl border-gray-100 border-2 px-8 py-2 w-full rounded-lg focus:border-gray-400 outline-0 pr-10"
                />
                <img
                  src="/Passwordkey.svg"
                  alt="Password"
                  className="absolute left-2 top-3 max-sm:h-6 max-sm:left-4 max-sm:top-5 max-sm:text-[16px] max-sm:w-6 h-5 w-5"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 max-sm:right-4 max-sm:top-5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Retype Password"
                  value={formData.confirmPassword}
                  autoComplete="new-password"
                  onChange={handleInputChange}
                  required
                  className="max-sm:border-gray-300 max-sm:text-[16px] max-sm:pl-12 max-sm:bg-white max-sm:h-[60px] max-sm:w-[85vw] max-sm:rounded-2xl border-gray-100 border-2 px-8 py-2 w-full rounded-lg focus:border-gray-400 outline-0 pr-10"
                />
                <img
                  src="/Passwordkey.svg"
                  alt="Password"
                  className="absolute left-2 max-sm:h-6 max-sm:left-4 max-sm:top-5 max-sm:text-[16px] max-sm:w-6 top-3 h-5 w-5"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 max-sm:right-4 max-sm:top-5 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-[10px] pt-2">
                I have agreed to the{" "}
                <button
                  type="button"
                  onClick={() => {
                    setPolicyModalType("privacy");
                    setPolicyModalOpen(true);
                  }}
                  className="inline underline"
                >
                  privacy policy
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={() => {
                    setPolicyModalType("terms");
                    setPolicyModalOpen(true);
                  }}
                  className="inline underline"
                >
                  terms & conditions
                </button>{" "}
                <label className="inline-flex items-center gap-2">
                  <div className="round">
                    <input
                      id="agree-checkbox"
                      type="checkbox"
                      checked={
                        formData.agreedToPrivacy && formData.agreedToTerms
                      }
                      readOnly
                    />
                    <label
                      htmlFor="agree-checkbox"
                      onClick={(e) => {
                        e.preventDefault();
                        // If both policies already accepted, allow toggling off (clears both)
                        if (
                          formData.agreedToPrivacy &&
                          formData.agreedToTerms
                        ) {
                          setFormData((p) => ({
                            ...p,
                            agreedToPrivacy: false,
                            agreedToTerms: false,
                          }));
                          return;
                        }

                        // Not fully accepted yet — open the missing policy modal
                        if (!formData.agreedToPrivacy) {
                          setPolicyModalType("privacy");
                          setPolicyModalOpen(true);
                        } else if (!formData.agreedToTerms) {
                          setPolicyModalType("terms");
                          setPolicyModalOpen(true);
                        }
                      }}
                    />
                  </div>

                  {/* no text next to checkbox by design */}
                </label>
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <Button
                type="submit"
                className="bg-[#74FFA7] hover:bg-[#74FFA7]/80  max-sm:h-[60px] max-sm:w-[85vw] max-sm:rounded-2xl text-(--dark-def) max-sm:text-[18px]"
                name={
                  registerMutation.status === "pending"
                    ? "Signing up..."
                    : "Sign up"
                }
                disabled={registerMutation.status === "pending"}
              />
            </div>
            <h6 className="text-[16px] sm:text-sm my-4 text-center max-sm:mb-8 max-sm:my-6">
              Can't Login?
            </h6>
            <div className="flex gap-2 max-sm:gap-[18px] justify-center max-sm:hidden items-center">
              <ResetDropdown />
              <OTPLogin />
            </div>
          </form>
        </div>
        <h2 className="font-light mt-10 max-sm:mt-0 max-sm:fixed max-sm:bottom-4 max-sm:bg-(--bg) max-sm:w-full max-sm:text-center max-sm:text-[14px]">
          I have an account already ? &nbsp;
          <Link to="/login">
            <h2 className="text-black inline opacity-100 hover:underline transition">
              Login
            </h2>
          </Link>
        </h2>
      </div>

      {isSmall ? (
        shouldShowOnboarding ? (
          <OnboardingScreen overlay onFinish={() => navigate("/login")} />
        ) : null
      ) : (
        <div className="lg:w-full lg:h-[90vh] lg:pr-5">
          <OnboardingScreen />
        </div>
      )}

      {/* Bottom-sheet modal for Privacy Policy / Terms */}
      {policyModalOpen &&
        policyModalType &&
        (() => {
          const activeQuery =
            policyModalType === "privacy" ? privacyQuery : termsQuery;
          const loading = activeQuery.isLoading || activeQuery.isFetching;
          const raw = activeQuery.data as any;
          const content =
            raw?.content ||
            raw?.html ||
            raw?.body ||
            raw?.text ||
            (typeof raw === "string"
              ? raw
              : raw
                ? JSON.stringify(raw, null, 2)
                : null);

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center h-screen w-screen">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setPolicyModalOpen(false)}
              />
              <div className="relative w-full max-w-3xl bg-white rounded-2xl p-4 max-h-[85vh] overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">
                    {policyModalType === "privacy"
                      ? "Privacy Policy"
                      : "Terms & Conditions"}
                  </h3>
                  <button
                    aria-label="Close"
                    onClick={() => setPolicyModalOpen(false)}
                    className="text-2xl leading-none px-2"
                  >
                    ×
                  </button>
                </div>

                <div
                  ref={contentRef}
                  onScroll={() => {
                    const el = contentRef.current;
                    if (!el) return;
                    if (
                      el.scrollTop + el.clientHeight >=
                      el.scrollHeight - 20
                    ) {
                      setHasScrolledToEnd(true);
                    }
                  }}
                  className="border-t pt-2 overflow-auto pb-12.5"
                  style={{ maxHeight: "72vh" }}
                >
                  {loading ? (
                    <div className="w-full py-8 text-center">Loading...</div>
                  ) : content ? (
                    /<[^>]+>/.test(content) ? (
                      <div
                        className="prose max-w-full"
                        dangerouslySetInnerHTML={{ __html: content }}
                      />
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm text-gray-700">
                        {content}
                      </pre>
                    )
                  ) : (
                    <div className="w-full py-8 text-center text-gray-600">
                      No content available.
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 mt-3 absolute bottom-2 right-10">
                  <div className="text-xs text-gray-500 invisible">
                    Scroll to the end to enable confirmation
                  </div>
                  <div>
                    <button
                      type="button"
                      disabled={!hasScrolledToEnd}
                      onClick={() => {
                        setFormData((p) => {
                          const next =
                            policyModalType === "privacy"
                              ? { ...p, agreedToPrivacy: true }
                              : { ...p, agreedToTerms: true };

                          if (next.agreedToPrivacy && next.agreedToTerms) {
                            toast.success(
                              "Thanks — you have accepted the privacy policy and terms.",
                            );
                          } else {
                            toast.success(
                              "Thanks — you have accepted the policy.",
                            );
                          }

                          return next;
                        });
                        setPolicyModalOpen(false);
                      }}
                      className={`px-4 py-2 rounded-lg ${hasScrolledToEnd ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
                    >
                      I have read and accept
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default SignInPage;
