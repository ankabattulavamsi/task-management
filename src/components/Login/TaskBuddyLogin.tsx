import React from "react";
import GoogleSignInButton from "../GoogleSignInButton";
import { LuNotepadText } from "react-icons/lu";

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
              <LuNotepadText />
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
