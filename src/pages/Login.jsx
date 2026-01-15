import { useState } from "react";
import { Link } from "react-router";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    console.log({ email, password });
    // 🔥 call your login API / Firebase here
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // 🔥 Google login logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="relative top-10 bottom-10 w-full max-w-md border-2 border-blue-900 rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center">
          Welcome Back
        </h2>
        <p className="text-center  mt-2">
          Login to continue
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm ">
              Email
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 w-5 h-5 " />
              <input
                type="email"
                name="email"
                required
                placeholder="example@email.com"
                className="w-full pl-10 pr-3 py-2 rounded-lg border dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm ">
              Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2 rounded-lg border dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 "
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition">
            Login
          </button>
        </form>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full mt-4 py-2 rounded-lg border flex items-center justify-center gap-2 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5"
          />
          Continue with Google
        </button>

        <p className="text-center text-sm mt-6 ">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-500 font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
