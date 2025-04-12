import React, { useState } from 'react'
import { useDeleteUserMutation, useGetUserQuery } from '../../../../redux/features/auth/authApi'
import { Link } from 'react-router-dom';
import UpdateUserModal from './UpdateUserModal';

const ManageUser = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null)
    const { data: users = [], error, isLoading, refetch } = useGetUserQuery();

    console.log(users)

    const [deleteUser] = useDeleteUserMutation()

    const handleDelete = async (id) => {
        try {
            const response = await deleteUser(id).unwrap();
            alert("User deleted successfully!")
            refetch();

        } catch (error) {
            console.error("Failed to delete user", error);
        }
    }

    const handleEdit = (user) => {
        setSelectedUser(user)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedUser(null)
    }
    return (
        <>
            {
                isLoading && <div>Loading...</div>

            }
            {
                error && <div>Error loading users data.</div>
            }
            <section className="py-8 bg-[#fdf8f5] font-montserrat">
  <div className="w-full px-4 mx-auto">
    <div className="bg-white rounded-md shadow-md overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h3 className="text-2xl font-semibold text-[#5a3928]">Manage Users</h3>
        <button className="bg-[#a1603e] text-white text-sm px-4 py-2 rounded-md hover:bg-[#8e4e31] transition">
          See all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-800">
          <thead className="bg-[#faeee3] text-[#7b4f39] uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3 border-b border-gray-200">No.</th>
              <th className="px-6 py-3 border-b border-gray-200">Email</th>
              <th className="px-6 py-3 border-b border-gray-200">Role</th>
              <th className="px-6 py-3 border-b border-gray-200">Edit</th>
              <th className="px-6 py-3 border-b border-gray-200">Delete</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, index) => (
              <tr
                key={index}
                className="hover:bg-[#f8f0ea] transition border-b border-gray-200"
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{user?.email || 'N/A'}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-[3px] font-medium text-xs inline-block border ${
                      user?.role === 'admin'
                        ? 'bg-[#5a3928] text-white border-[#5a3928]'
                        : 'bg-[#f1c98a] text-[#5a3928] border-[#e4aa64]'
                    }`}
                  >
                    {user?.role === 'admin' ? 'ADMIN' : user?.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(user)}
                    className="flex items-center gap-1 text-[#a1603e] hover:text-[#7b4f39] transition"
                  >
                    <i className="ri-edit-2-line"></i>
                    Edit
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(user?._id)}
                    className="bg-[#d64545] text-white px-3 py-1 rounded-sm hover:bg-[#b93a3a] transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  {isModalOpen && (
    <UpdateUserModal
      user={selectedUser}
      onClose={handleCloseModal}
      onRoleUpdate={refetch}
    />
  )}
</section>



            {
                isModalOpen && <UpdateUserModal user={selectedUser} onClose={handleCloseModal} onRoleUpdate={refetch} />
            }
        </>
    )
}

export default ManageUser