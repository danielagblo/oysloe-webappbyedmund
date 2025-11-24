import { useState } from "react";
import EditProfilePage from "./EditProfilePage";

const AccountPage = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");

  const handleDelete = () => {
    // TODO: call API with deleteReason
    console.log("Deleting account for reason:", deleteReason);
    setShowDeleteModal(false);
    setDeleteReason("");
  };

  if (showEdit) {
    return <EditProfilePage setShowEdit={setShowEdit}/>;
  }

  return (
    <div className="flex flex-col items-center w-full h-full justify-center">
      <div className="flex flex-col gap-4 items-center bg-white sm:h-[93vh] w-full max-sm:h-screen max-sm:w-screen max-sm:pt-30 p-6 rounded-2xl">
        <h2 className="text-2xl text-[var(--dark-def)] font-semibold">Account Settings</h2>

        <div className="flex gap-4 flex-col">
          <button
            className="px-10 py-4 border bg-blue-600 hover:border-blue-600 hover:bg-transparent text-white hover:text-blue-600 rounded-lg transition"
            onClick={() => setShowEdit(true)}
          >
            Edit Profile
          </button>

          <button
            className="px-10 py-4 border bg-red-600 hover:border-red-600 hover:bg-transparent text-white rounded-lg hover:text-red-600 transition"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete your Account
          </button>
        </div>

        {showDeleteModal && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowDeleteModal(false)}
            />

            <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg flex flex-col gap-4">
              <h3 className="text-xl font-semibold">Confirm Account Deletion</h3>
              <textarea
                placeholder="Why do you want to delete your account?"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded resize-none"
                rows={4}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
