import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import useAxios from "../hooks/useAxiosSecure";
import { toast } from "react-toastify";

const Login = () => {
  // dynamic title
  useEffect(() => {
    document.title = "Login | Gallery";
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const { logIn, googleSignIn, setUser } = useContext(AuthContext);
  const axios = useAxios();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      toast.loading("Logging in...");

      // 1️⃣ Firebase auth
      await logIn(email, password);

      // 2️⃣ Check backend DB
      const res = await axios.post("/users/login", { email });

      toast.dismiss();
      if (res.data.success) {
        setUser(res.data.user);
        toast.success(res.data.message);
        navigate(from, { replace: true });
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.dismiss();
      console.log(err);
      toast.error("Login failed. Check your credentials or server ⚠️");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      toast.loading("Signing in with Google...");

      const result = await googleSignIn();
      const firebaseUser = result.user;

      // Backend check
      const res = await axios.post("/auth/google_login", {
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photo: firebaseUser.photoURL,
      });

      toast.dismiss();

      if (res.data.success && res.data.existing) {
        setUser(res.data.user);
        toast.success(res.data.message);
        navigate(from, { replace: true });
      } else if (!res.data.existing) {
        toast.info(res.data.message);
        navigate("/register", {
          state: {
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            photo: firebaseUser.photoURL,
          },
        });
      }
    } catch (err) {
      toast.dismiss();
      console.log(err);
      toast.error("Google login failed ⚠️");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="relative top-10 w-full max-w-md border-2 border-blue-900 rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center">Welcome Back</h2>
        <p className="text-center mt-2">Login to continue</p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="text-sm">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 w-5 h-5" />
              <input
                type="email"
                name="email"
                required
                placeholder="example@email.com"
                className="w-full pl-10 pr-3 py-2 rounded-lg border dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm">Password</label>
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
                className="absolute right-3 top-3"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition">
            Login
          </button>
        </form>

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

        <p className="text-center text-sm mt-6">
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
