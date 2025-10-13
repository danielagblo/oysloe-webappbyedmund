import MenuButton from "../components/MenuButton";
import ProfileSidebar from "../components/ProfileSidebar";

const ProfilePage = () => {
    return (
        <div className="flex gap-6 p-4 px-3 justify-evenly h-screen w-screen items-center bg-gray-100">
            <div className="w-1/5">
                <ProfileSidebar />
            </div>
            <div className="w-2/5"></div>
            <div className="w-3/5"></div>
            <MenuButton />
        </div>
    );
}

export default ProfilePage;
