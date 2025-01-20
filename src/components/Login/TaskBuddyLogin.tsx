import { LuNotepadText } from "react-icons/lu";
import { signInWithGoogle } from "../../authService";
import { FcGoogle } from "react-icons/fc";
import Circle from "../../assets/Images/circles_bg.png";

const TaskBuddyLogin = () => {
  const handleSignIn = async () => {
    const user = await signInWithGoogle();
    if (user) {
      console.log("User signed in: ", user);
    } else {
      console.error("Sign-in failed.");
    }
  };

  return (
    <div className="flex items-center justify-between h-screen ">
      <div className="flex items-center flex-col justify-items-start pl-10">
        {/* Logo and Title */}
        <div className="flex flex-col mb-8 ">
          <div className="flex items-center gap-2 mb-6">
            <h1 className="">
              <LuNotepadText size={32} color="#7B1984" />
            </h1>
            <h1 className="text-3xl font-semibold leading-loose text-[#7B1984]">
              TaskBuddy
            </h1>
          </div>

          <p className="text-gray-600 max-w-sm">
            Streamline your workflow and track progress effortlessly with our
            all-in-one task management app.
          </p>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleSignIn}
          className="flex items-center justify-center gap-3 border-2 rounded-3xl px-10 py-4 w-full bg-[#292929] text-white hover:bg-gray-800"
        >
          <FcGoogle size={22} />
          <p className="font-medium text-lg leading-9">Continue with Google</p>
        </button>
      </div>

      <div>
        <img src={Circle} alt="circle" />
      </div>
    </div>
  );
};

export default TaskBuddyLogin;
