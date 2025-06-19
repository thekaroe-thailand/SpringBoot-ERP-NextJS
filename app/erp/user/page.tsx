'use client'

import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { Config } from "@/app/Config"
import Modal from "../components/Modal"
import axios from "axios"
import { UserInterface } from "@/app/interface/UserInterface"

export default function Page() {
    const [users, setUsers] = useState<UserInterface[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<UserInterface | null>(null);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('employee');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${Config.apiUrl}/api/users`);

            if (response.status == 200) {
                setUsers(response.data);
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: (error as Error).message,
                icon: 'error'
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingUser
                ? `${Config.apiUrl}/api/users/admin-update-profile`
                : `${Config.apiUrl}/api/users/admin-create`

            const payload = {
                id: editingUser?.id || null,
                email: email,
                username: username,
                password: password || '',
                role: role
            }

            const headers = {
                'Authorization': 'Bearer ' + localStorage.getItem(Config.tokenKey)
            }
            const response = await axios.post(url, payload, { headers });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'success',
                    text: `User  + ${editingUser ? 'updated' : 'created'} successfullay`,
                    timer: 1000
                })

                setShowModal(false);
                setEditingUser(null);
                setEmail('');
                setUsername('');
                setPassword('');

                fetchUsers();
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: (error as Error).message,
                icon: 'error'
            })
        }
    }

    const handleDelete = async (user: UserInterface) => {
        try {
            const result = await Swal.fire({
                icon: 'warning',
                title: 'Are you sure?',
                text: `Do you want to delete user ${user.username}`,
                showCancelButton: true,
                showConfirmButton: true
            })

            if (result.isConfirmed) {
                const headers = {
                    'Authorization': 'Bearer ' + localStorage.getItem(Config.tokenKey)
                }
                const url = `${Config.apiUrl}/api/users/admin-delete/${user.id}`;
                const response = await axios.delete(url, { headers })

                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'success',
                        text: 'User deleted successfully',
                        timer: 1000
                    })

                    fetchUsers();
                }
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: (error as Error).message,
                icon: 'error'
            })
        }
    }

    const handleEdit = (user: UserInterface) => {
        setEditingUser(user);
        setEmail(user.email);
        setUsername(user.username);
        setPassword('');
        setShowModal(true);
        setRole(user.role ?? 'employee');
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-5">User Management</h1>

            <div className="flex justify-between items-center mb-6">
                <button className="button-add"
                    onClick={() => {
                        setEditingUser(null)
                        setEmail('')
                        setUsername('')
                        setPassword('')
                        setShowModal(true)
                    }}
                >
                    <i className="fas fa-plus mr-2"></i>
                    Add User
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th className="w-[120px]">Username</th>
                            <th>ระดับการใช้งาน</th>
                            <th className="text-right" style={{ width: '100px' }}>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.email}</td>
                                <td>{user.username}</td>
                                <td>{user.role}</td>
                                <td className="text-right">
                                    <button className="table-action-btn table-edit-btn mr-2"
                                        onClick={() => handleEdit(user)}
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="table-action-btn table-delete-btn"
                                        onClick={() => handleDelete(user)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <Modal id="user-modal" title="ข้อมูลผู้ใช้งาน" onClose={() => setShowModal(false)} size="md">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-2">Email</label>
                            <input type="email" className="form-input" value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Username</label>
                            <input type="text" className="form-input" value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Password</label>
                            <input type="password" className="form-input"
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">ระดับการใช้งาน</label>
                            <select className="form-input" value={role}
                                onChange={e => setRole(e.target.value)}
                            >
                                <option value="employee">Employee</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setShowModal(false)}
                                className="modal-btn modal-btn-cancel">
                                <i className="fas fa-times mr-2"></i>
                                ยกเลิก
                            </button>
                            <button type="submit" className="modal-btn modal-btn-submit">
                                <i className="fas fa-check mr-2"></i>
                                บันทึก
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    )
}











