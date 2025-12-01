import { useEffect, useState } from "react";
import { toast } from "sonner";
import useUserProfile from "../features/userProfile/useUserProfile";
import { createAccountDeleteRequest, getUserAccountDeleteRequests } from "../services/accountDeleteRequestService";
import { buildMediaUrl } from "../services/media";

const ProfileView = ({ onEdit }: { onEdit: () => void }) => {
    const { profile } = useUserProfile();
    const [requesting, setRequesting] = useState(false);
    const [requestSent, setRequestSent] = useState(false);

    const avatarPlaceholder = "https://placehold.co/100x100?text=Avatar&bg=EFEFEF&fg=666";
    const logoPlaceholder = "https://placehold.co/100x100?text=Logo&bg=EFEFEF&fg=666";
    const frontPlaceholder = "https://placehold.co/500x250?text=Front&bg=EFEFEF&fg=666";
    const backPlaceholder = "https://placehold.co/500x250?text=Back&bg=EFEFEF&fg=666";

    const onImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallback: string = avatarPlaceholder) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = fallback;
    };

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const existing = await getUserAccountDeleteRequests({});
                if (!mounted) return;
                // if any exist, consider it sent (backend usually returns user's requests)
                setRequestSent(existing && existing.length > 0);
            } catch {
                // ignore
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const handleRequestDelete = async () => {
        if (requestSent) {
            toast.message("Account delete request already sent");
            return;
        }

        const reason = window.prompt("Please enter a reason for deleting your account (optional)");
        if (reason === null) return; // user cancelled

        try {
            setRequesting(true);
            await createAccountDeleteRequest({ reason: reason || "" });
            setRequestSent(true);
            toast.success("Account delete request submitted");
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            toast.error(msg || "Failed to submit request");
        } finally {
            setRequesting(false);
        }
    };

    if (!profile)
        return (
            <div className="relative bg-white md:shadow-lg h-fit sm:min-h-[92vh] pt-10 md:pb-12 w-full md:mt-0 md:pt-10 flex flex-col justify-start items-center gap-4 px-3 py-3 md:rounded-2xl text-xs max-lg:mb-10">
                <div className="w-[95%]">
                    <p>Loading profile...</p>
                </div>
            </div>
        );

    const p = profile as unknown as Record<string, unknown>;

    return (
        <div className="no-scrollbar relative bg-white md:shadow-lg h-fit sm:min-h-[92vh] pt-10 md:pb-12 w-full md:mt-0 md:pt-10 flex flex-col justify-start items-center gap-4 px-3 py-3 md:rounded-2xl text-xs max-lg:max-h-[92vh] max-lg:overflow-auto">
            <div className="w-[95%] max-w-3xl">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <img
                            src={buildMediaUrl(profile.avatar) || avatarPlaceholder}
                            alt="avatar"
                            className="w-20 h-20 rounded-full object-cover bg-gray-100"
                            onError={(e) => onImgError(e, avatarPlaceholder)}
                        />
                        <div>
                            <h2 className="text-lg font-medium">{profile.name}</h2>
                            <p className="text-sm text-gray-600">{profile.email} {profile.email ? <span className="ml-2 inline text-white bg-blue-400 px-1 py-0.5 text-[0.6rem] rounded-2xl">Verified</span> : <span className="ml-2 inline text-white bg-gray-400 px-1 py-0.5 text-[0.6rem] rounded-2xl">Unverified</span>}</p>
                            <p className="text-sm text-gray-600">{profile.phone} {profile.phone ? <span className="ml-2 inline text-white bg-blue-400 px-1 py-0.5 text-[0.6rem] rounded-2xl">Verified</span> : null}</p>
                        </div>

                        {/* business logo (hidden on small screens) */}
                        <div className="ml-4 hidden sm:flex items-center gap-2">
                            <img
                                src={buildMediaUrl(profile.business_logo) || logoPlaceholder}
                                alt="business logo"
                                className="w-16 h-16 rounded-md object-cover bg-gray-100"
                                onError={(e) => onImgError(e, logoPlaceholder)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <button
                            onClick={onEdit}
                            className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleRequestDelete}
                            disabled={requesting || requestSent}
                            className={`px-3 py-1 rounded-full ${requestSent ? "bg-green-200" : "bg-red-200 hover:bg-red-300"}`}
                        >
                            {requesting ? "Sending..." : requestSent ? "Request Sent" : "Request Account Delete"}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-gray-500">Business Name</p>
                        <p className="mb-2">{profile.business_name || "-"}</p>

                        <p className="text-xs text-gray-500">Account Name</p>
                        <p className="mb-2">{profile.account_name || "-"}</p>

                        <p className="text-xs text-gray-500">Account Number</p>
                        <p className="mb-2">{profile.account_number || "-"}</p>
                        <p className="text-xs text-gray-500">Address</p>
                        <p className="mb-2">{(p['address'] as string) || "-"}</p>
                        <p className="text-xs text-gray-500">Preferred Notification Email</p>
                        <p className="mb-2">{(p['preferred_notification_email'] as string) || "-"}</p>
                        <p className="text-xs text-gray-500">Preferred Notification Phone</p>
                        <p className="mb-2">{(p['preferred_notification_phone'] as string) || "-"}</p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">National ID</p>
                        <p className="mb-2">{profile.id_number || "-"} {profile.id_number ? <span className="ml-2 inline text-white bg-blue-400 px-1 py-0.5 text-[0.6rem] rounded-2xl">Verified</span> : <span className="ml-2 inline text-white bg-gray-400 px-1 py-0.5 text-[0.6rem] rounded-2xl">Not Verified</span>}</p>

                        <p className="text-xs text-gray-500">Mobile Network</p>
                        <p className="mb-2">{profile.mobile_network || "-"}</p>

                        <p className="text-xs text-gray-500">Second Number</p>
                        <p className="mb-2">{profile.second_number || "-"}</p>

                        {/* ID front/back images if available */}
                        <div className="mt-4">
                            <p className="text-xs text-gray-500">ID Front</p>
                            <img src={buildMediaUrl(p['id_front_page'] as string | undefined) || frontPlaceholder} className="w-full max-w-full h-auto rounded-md object-cover bg-gray-100 mb-2" onError={(e) => onImgError(e, frontPlaceholder)} />
                            <p className="text-xs text-gray-500">ID Back</p>
                            <img src={buildMediaUrl(p['id_back_page'] as string | undefined) || backPlaceholder} className="w-full max-w-full h-auto rounded-md object-cover bg-gray-100" onError={(e) => onImgError(e, backPlaceholder)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
