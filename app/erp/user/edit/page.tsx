'use client'

import { useState, useEffect } from "react"
import axios from "axios"
import { Config } from "@/app/Config"
import Swal from "sweetalert2"
import { useRouter } from "next/navigation"

export default function EditProfile() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem(Config.tokenKey);
            const response = await axios.get(`${Config.apiUrl}/api/users/admin-info`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.status === 200) {
                setUsername(response.data.username);
                setEmail(response.data.email);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: 'ไม่สามารถดึงข้อมูลผู้ใช้งานได้'
            })
        }
    }

    const handleSubmit = async () => {
        try {
            if (password !== confirmPassword) {
                Swal.fire({
                    icon: 'error',
                    text: 'รหัสผ่านไม่ตรงกัน',
                    title: 'error'
                })
                return
            }

            const token = localStorage.getItem(Config.tokenKey);
            const url = `${Config.apiUrl}/api/users/admin-edit-profile`;
            const payload = {
                username,
                email,
                password
            }
            const headers = {
                'Authorization': 'Bearer ' + token
            }

            const response = await axios.post(url, payload, { headers })

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'แก้ไขข้อมูลสำเร็จ'
                })
                router.push('/erp/dashboard')
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: 'ไม่สามารถแก้ไขข้อมูลได้'
            })
        }
    }

    return (
        <div>
            <h1 className="login-title">แก้ไขข้อมูลส่วนตัว</h1>
            <div className="login-form">
                <div className="form-group">
                    <label className="form-label">Username</label>
                    <input type="text" className="form-input"
                        value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input"
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-input"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input type="password" className="form-input"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div className="form-group flex items-center">
                    <button type="button" className="button" onClick={handleSubmit}>
                        <i className="fas fa-save mr-2"></i>
                        บันทึก
                    </button>
                </div>
            </div>
        </div>
    )
}