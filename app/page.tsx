'use client'

import { useState } from "react";
import { Config } from "./Config";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const url = `${Config.apiUrl}/api/users/admin-signin`;
      const payload = {
        username: username,
        password: password
      }
      const response = await axios.post(url, payload);

      if (response.status === 200) {
        localStorage.setItem(Config.tokenKey, response.data);
        router.push('/erp/dashboard');
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid username or password'
      })
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">
          <i className="fas fa-leaf"></i> Spring-ERP 2025
        </h1>
        <h2 className="login-subtitle">
          ระบบ Enterprise Resource Planning
        </h2>
        <form className="login-form">
          <div className="form-group">
            <label className="form-label">
              <i className="fas fa-user mr-2"></i>
              Username
            </label>
            <input type="text" className="form-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              <i className="fas fa-lock mr-2"></i>
              Password
            </label>
            <input type="password" className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="login-button"
            onClick={handleSignIn}>
            <i className="fas fa-sign-in-alt mr-2"></i>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
