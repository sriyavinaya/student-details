import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";

const GoogleLoginButton = ({ selectedRole }) => {
  const [error, setError] = useState("");

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (!selectedRole) {
        setError("Please select a role before logging in.");
        return;
      }

      try {
        const userInfoResponse = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        const { email, given_name, family_name } = userInfoResponse.data;
        const backendResponse = await axios.post(
          "http://localhost:8080/api/google-login",
          {
            email,
            firstName: given_name,
            lastName: family_name,
            role: selectedRole,
          },
          { withCredentials: true }
        );

        if (backendResponse.data.newUser === true) {
          alert("Not registered yet. Please complete the registration process.");
          window.location.href = "/login";
        } else {
          // Handle successful login or redirection
          alert("Login successful!");
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Google login failed:", error);
        setError("An error occurred during Google login. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      setError("Login failed. Please try again.");
    },
  });

  return (
    <div className="w-full">
      <button
        onClick={googleLogin}
        className="w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-lg text-lg font-bold shadow-md hover:scale-105 transition-transform duration-200"
      >
        <FcGoogle className="text-xl mr-2" /> Sign in with Google
      </button>
      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
    </div>
  );
};

export default GoogleLoginButton;