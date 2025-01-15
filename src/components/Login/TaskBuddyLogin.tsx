import React from "react";
import GoogleSignInButton from "../GoogleSignInButton";

const TaskBuddyLogin = () => {
  const handleGoogleLogin = () => {
    // Implement Google OAuth login logic here
    console.log("Google login clicked");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="pt-6 pb-8 px-8">
          {/* Logo and Title */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-purple-700 rounded flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-white"
                >
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
                  <path d="M12 11h4" />
                  <path d="M12 16h4" />
                  <path d="M8 11h.01" />
                  <path d="M8 16h.01" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-purple-700">TaskBuddy</h1>
            </div>

            <p className="text-center text-gray-600 max-w-sm">
              Streamline your workflow and track progress effortlessly with our
              all-in-one task management app.
            </p>
          </div>

          {/* Google Login Button */}
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
};

export default TaskBuddyLogin;
