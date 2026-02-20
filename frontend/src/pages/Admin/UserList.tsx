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
    if (window.confirm("Are you sure? This action cannot be undone.")) {
      try {
        await deleteUser(id);
        refetch();
        toast.success("User eliminated from the matrix");
      } catch (err) {
        const error = err as ApiError;
        toast.error(
          error?.data?.message || error.error || "De-authorization failed",
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
      toast.success("Identity updated successfully");
    } catch (err) {
      const error = err as ApiError;
      toast.error(error?.data?.message || error.error || "Update rejected");
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4 md:px-10 pt-24 lg:ml-[8%] transition-all duration-300 font-sans text-white">
      <AdminMenu />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-2">
            <div className="px-4 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-[0.2em] w-fit">
              User Directory
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Manage <span className="text-primary ">Members</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-3">
            <div className="text-center">
              <p className="text-[8px] font-bold text-text-muted uppercase tracking-widest">
                Total Users
              </p>
              <p className="text-xl font-black ">{users?.length || 0}</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="error">
            {(error as ApiError)?.data?.message ||
              (error as ApiError).error ||
              "Failed to retrieve user data"}
          </Message>
        ) : (
          <div className="glass-card rounded-[2.5rem] border-white/5 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="py-6 px-8 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                      Identification
                    </th>
                    <th className="py-6 px-8 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                      Profile
                    </th>
                    <th className="py-6 px-8 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                      Access Level
                    </th>
                    <th className="py-6 px-8 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] text-right">
                      Operations
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users?.map((user: UserInfo) => (
                    <tr
                      key={user._id}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-6 px-8">
                        <span className="font-mono text-[10px] text-text-muted bg-white/5 px-2 py-1 rounded">
                          {user._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="py-6 px-8">
                        {editableUserId === user._id ? (
                          <div className="space-y-2 max-w-xs">
                            <input
                              type="text"
                              value={editableUserName}
                              onChange={(e) =>
                                setEditableUserName(e.target.value)
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-primary transition-all outline-none"
                              placeholder="Username"
                            />
                            <input
                              type="email"
                              value={editableUserEmail}
                              onChange={(e) =>
                                setEditableUserEmail(e.target.value)
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-primary transition-all outline-none"
                              placeholder="Email"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateHandler(user._id)}
                                className="px-4 py-2 bg-primary text-white text-[8px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2"
                              >
                                <FaCheck size={10} /> Commit
                              </button>
                              <button
                                onClick={() => setEditableUserId(null)}
                                className="px-4 py-2 bg-white/5 text-text-muted text-[8px] font-bold uppercase tracking-widest rounded-lg"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold flex items-center gap-2">
                                {user.username}
                                <button
                                  onClick={() =>
                                    toggleEdit(
                                      user._id,
                                      user.username,
                                      user.email,
                                    )
                                  }
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-primary"
                                >
                                  <FaEdit size={12} />
                                </button>
                              </div>
                              <div className="text-[10px] text-text-muted">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="py-6 px-8">
                        {user.isAdmin ? (
                          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full w-fit">
                            <div className="w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                            <span className="text-[8px] font-black text-primary uppercase tracking-widest">
                              Administrator
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full w-fit">
                            <div className="w-1 h-1 rounded-full bg-gray-500" />
                            <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">
                              Regular Member
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-6 px-8 text-right">
                        {!user.isAdmin && (
                          <button
                            onClick={() => deleteHandler(user._id)}
                            className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 ml-auto group/del"
                            title="Revoke Access"
                          >
                            <FaTrash
                              size={14}
                              className="group-hover/del:scale-110"
                            />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
