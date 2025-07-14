import React, { useState } from "react";
import { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import './Login2.css'
import  { authDatacontext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";

export default function Login2() {
  let {serverURL} = useContext(authDatacontext)
  let {userData, setuserData} = useContext(userDataContext)
  const [isSignUp, setIsSignUp] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 730);
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 730);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await axios.post(serverURL+'/api/auth/signup', {
        firstName,
        lastName,
        UserName: username, // match backend field name
        email,
        password
      },{ withCredentials: true })
     
      console.log(res);
      setuserData(res.data)
      setFirstName('')
      setLastName('')
      setUsername('')
      setEmail('')
      setPassword('')
      
    } catch (err) {
      setError(err.response?.data?.message || 'Server error or invalid input')
    }
    setLoading(false)
  }

  const handleSubmit2 = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await axios.post(serverURL+'/api/auth/signin', {
        email,
        password
      }, { withCredentials: true })
     
        console.log(res);
        setuserData(res.data)
        
        setEmail('')
        setPassword('')
        
      
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials or server error')
    }
    setLoading(false)
  }

  return (
    <div className="auth-bg">
      <div className={`auth-root${isSignUp ? " signup-active" : ""}`}>
        {/* Sign In Form */}
        {(!isMobile || !isSignUp) && (
          <div className="auth-panel">
            <form className="auth-form" autoComplete="off" onSubmit={handleSubmit2}>
              <h1 className="auth-title">Sign In</h1>
              <span className="auth-span">or use your email password</span>
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="auth-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="auth-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
              {error && <div className="text-red-600 text-center">{error}</div>}
              {isMobile && (
                <div className="auth-mobile-toggle">
                  <span>Don't have an account?</span>
                  <button type="button" className="auth-switch-btn" onClick={() => setIsSignUp(true)}>Sign Up</button>
                </div>
              )}
            </form>
          </div>
        )}
        {/* Sign Up Form */}
        {(!isMobile || isSignUp) && (
          <div className="auth-panel">
            <form
              className="bg-white p-8 rounded shadow-md w-full max-w-sm flex flex-col gap-4 mt-[100px]"
              onSubmit={handleSubmit}
            >
              <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
              {error && <div className="text-red-600 text-center">{error}</div>}
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="border rounded px-3 py-2"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="border rounded px-3 py-2"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="border rounded px-3 py-2"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="border rounded px-3 py-2"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="border rounded px-3 py-2"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-yellow-400 text-blue-900 font-semibold px-4 py-2 rounded hover:bg-yellow-300 transition"
                disabled={loading}
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
              <p className="text-center">
                Already have an account?{' '}
                <span
                  className="text-blue-700 cursor-pointer"
                  onClick={() => navigate('/signup')}
                >
                  Login
                </span>
              </p>
            </form>
          </div>
        )}
        {/* Overlay only on desktop/tablet */}
        {!isMobile && (
          <div className="auth-overlay-container">
            <div className="auth-overlay">
              <div className="auth-overlay-panel auth-overlay-left">
                <h1>Welcome Back!</h1>
                <p>Enter your personal details to use all of site features</p>
                <button className="auth-btn ghost" onClick={() => setIsSignUp(false)} type="button">
                  Sign In
                </button>
              </div>
              <div className="auth-overlay-panel auth-overlay-right">
                <h1>Hello, Friend!</h1>
                <p>Register with your personal details to use all of site features</p>
                <button className="auth-btn ghost" onClick={() => setIsSignUp(true)} type="button">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}