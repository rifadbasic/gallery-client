import { useState } from "react";
import { Link } from "react-router";
import { Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    const form = e.target;

    const userData = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      photo: form.photo.files[0],
      password: form.password.value,
      confirm: form.confirm.value,
    };

    console.log(userData);
  };

  const handleGoogleRegister = () => {
    console.log("Google register clicked");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 mb-6">
      <div className=" relative top-10 bottom-10 w-full max-w-2xl border-2 border-blue-900 rounded-2xl shadow-xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Grid Row 1: Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Name"
              name="name"
              placeholder="Your name"
              icon={<User />}
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="example@email.com"
              icon={<Mail />}
            />
          </div>

          {/* Grid Row 2: Phone + Photo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Contact Number"
              name="phone"
              placeholder="+880..."
              icon={<Phone />}
            />

            <div>
              <label className="text-sm font-medium">Profile Picture</label>
              <input
                type="file"
                name="photo"
                required
                className="w-full mt-1 text-sm file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:bg-indigo-100 file:text-indigo-600
                hover:file:bg-indigo-200"
              />
            </div>
          </div>

          {/* Password */}
          <PasswordField
            label="Password"
            name="password"
            show={showPassword}
            setShow={setShowPassword}
          />

          {/* Confirm Password */}
          <PasswordField
            label="Confirm Password"
            name="confirm"
            show={showConfirm}
            setShow={setShowConfirm}
          />

          <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition active:scale-95">
            Register
          </button>
        </form>

        {/* Google */}
        <button
          onClick={handleGoogleRegister}
          className="w-full mt-4 py-3 rounded-xl border flex items-center justify-center gap-2 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5"
          />
          <span className="font-medium">Register with Google</span>
        </button>

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-500 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

/* 🔹 Reusable Input */
const InputField = ({ label, icon, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <div className="relative mt-1">
      <span className="absolute left-3 top-3 text-gray-400">{icon}</span>
      <input
        {...props}
        required
        className="w-full pl-10 py-3 rounded-xl border text-sm
        dark:border-gray-700 
        focus:ring-2 focus:ring-indigo-500 outline-none"
      />
    </div>
  </div>
);

/* 🔹 Password Field */
const PasswordField = ({ label, name, show, setShow }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <div className="relative mt-1">
      <Lock className="absolute left-3 top-3" />
      <input
        type={show ? "text" : "password"}
        name={name}
        required
        className="w-full pl-10 pr-12 py-3 rounded-xl border text-sm
        dark:border-gray-700 
        focus:ring-2 focus:ring-indigo-500 outline-none"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-3 text-gray-500"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  </div>
);

export default Register;
