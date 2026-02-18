import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import type { UserInfo, ApiError } from "../../types";
import type { FC } from "react";
import Message from "../../components/Message";
import AdminMenu from "./AdminMenu";

const UserList: FC = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState<string | null>(null);
  const [editableUserName, setEditableUserName] = useState<string>("");
  const [editableUserEmail, setEditableUserEmail] = useState<string>("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteUser(id);
        refetch();
        toast.success("User deleted successfully");
      } catch (err) {
        const error = err as ApiError;
        toast.error(
          error?.data?.message || error.error || "Error deleting user",
        );
      }
    }
  };

  const toggleEdit = (id: string, username: string, email: string) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id: string) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
      toast.success("User updated successfully");
    } catch (err) {
      const error = err as ApiError;
      toast.error(error?.data?.message || error.error || "Error updating user");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-background text-white ml-20">
      <AdminMenu />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-500 border-b border-gray-700 pb-4">
          User Management
        </h1>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="error">
            {(error as ApiError)?.data?.message ||
              (error as ApiError).error ||
              "Error loading users"}
          </Message>
        ) : (
          <div className="overflow-x-auto shadow-2xl rounded-lg glass">
            <table className="w-full table-auto">
              <thead className="bg-gray-800 text-gray-300 uppercase text-sm leading-normal">
                <tr>
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-left">NAME</th>
                  <th className="py-3 px-6 text-left">EMAIL</th>
                  <th className="py-3 px-6 text-center">ADMIN</th>
                  <th className="py-3 px-6 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="text-gray-200 text-sm font-light">
                {users?.map((user: UserInfo) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                  >
                    <td className="py-3 px-6 text-left font-mono text-xs text-gray-400">
                      {user._id}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {editableUserId === user._id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editableUserName}
                            onChange={(e) =>
                              setEditableUserName(e.target.value)
                            }
                            className="p-1 rounded bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-blue-500 w-full"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="bg-green-500 p-1 rounded hover:bg-green-600 text-white transition-colors"
                          >
                            <FaCheck size={12} />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="flex items-center group cursor-pointer"
                          onClick={() =>
                            toggleEdit(user._id, user.username, user.email)
                          }
                        >
                          <span className="font-medium">{user.username}</span>
                          <FaEdit className="ml-2 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {editableUserId === user._id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editableUserEmail}
                            onChange={(e) =>
                              setEditableUserEmail(e.target.value)
                            }
                            className="p-1 rounded bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-blue-500 w-full"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <a
                            href={`mailto:${user.email}`}
                            className="hover:text-blue-400 hover:underline transition-colors"
                          >
                            {user.email}
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex items-center justify-center">
                        {user.isAdmin ? (
                          <span className="bg-green-200 text-green-800 py-1 px-3 rounded-full text-xs font-bold uppercase">
                            Admin
                          </span>
                        ) : (
                          <span className="bg-gray-600 text-gray-200 py-1 px-3 rounded-full text-xs font-bold uppercase">
                            User
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center">
                        {!user.isAdmin && (
                          <button
                            onClick={() => deleteHandler(user._id)}
                            className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-sm"
                            title="Delete User"
                          >
                            <FaTrash size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
