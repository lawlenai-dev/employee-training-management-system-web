import { Check, Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { api } from "../api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // if (!form.username.trim() || !form.password.trim()) {
    //   setError("กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน");
    //   return;
    // }

    try {
    //   setLoading(true);

    //   const response = await api("/auth/login", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       username: form.username.trim(),
    //       password: form.password,
    //     }),
    //   });

    //   if (remember) {
    //     localStorage.setItem("access_token", response.data.token);
    //   } else {
    //     sessionStorage.setItem("access_token", response.data.token);
    //   }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
    relative flex h-dvh w-full
    items-stretch justify-stretch
    overflow-hidden bg-white p-0 font-sans

    sm:items-center sm:justify-center
    sm:bg-[#edf2f7] sm:px-4 sm:py-6
  "
    >
      {/* วงกลมตกแต่งพื้นหลัง */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-[#003274]/15 blur-3xl" />

      {/* กรอบหลัก */}
      <main
        className="
    relative h-dvh w-full max-w-none
    overflow-y-auto bg-white shadow-none

    [scrollbar-width:none]
    [&::-webkit-scrollbar]:hidden

    sm:h-auto
    sm:max-h-[calc(100dvh-3rem)]
    sm:max-w-[600px]
    sm:rounded-[28px]
    sm:border sm:border-slate-200
    sm:shadow-2xl sm:shadow-[#001a3d]/20
  "
      >
        {/* แถบด้านบน */}
        <div className="flex items-center justify-between px-6 pt-5">
          <p className="text-xs font-bold text-slate-600">CHK</p>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <Check size={14} strokeWidth={3} />
            พร้อมใช้งาน
          </div>
        </div>

        <div className="px-5 pb-4 pt-2 sm:pt-10 sm:px-8 ">
          {/* Logo */}
          <div className="text-center">
            {/* <div
              className="
                mx-auto flex h-20 w-20 items-center justify-center
                rounded-full bg-white p-1
                ring-1 ring-slate-200 shadow-md
              "
            >
              <img
                src={Logo}
                alt="CHK Logo"
                className="h-full w-full rounded-full object-contain"
              />
            </div> */}

            <h1 className="mt-5 text-2xl font-bold text-[#002c63]">
              ระบบบันทึกการอบรม
            </h1>

            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="h-px w-6 bg-amber-400" />

              {/* <p className="text-sm font-bold tracking-[0.18em] text-amber-600">
                LPHPP · CHK
              </p> */}

              <span className="h-px w-6 bg-amber-400" />
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Employee Training Management System
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-9 space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-semibold text-slate-600"
              >
                ชื่อผู้ใช้งาน
              </label>

              <div className="relative">
                <UserRound
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="กรอกชื่อผู้ใช้งาน"
                  value={form.username}
                  onChange={handleChange}
                  className="
                    h-14 w-full rounded-xl border border-slate-300
                    bg-white pl-12 pr-4 text-base text-slate-900
                    outline-none transition
                    placeholder:text-slate-400
                    hover:border-slate-400
                    focus:border-blue-600
                    focus:ring-4 focus:ring-blue-100
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-600"
              >
                รหัสผ่าน
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="กรอกรหัสผ่าน"
                  value={form.password}
                  onChange={handleChange}
                  className="
                    h-14 w-full rounded-xl border border-slate-300
                    bg-white pl-12 pr-12 text-base text-slate-900
                    outline-none transition
                    placeholder:text-slate-400
                    hover:border-slate-400
                    focus:border-blue-600
                    focus:ring-4 focus:ring-blue-100
                  "
                />

                <button
                  type="button"
                  aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                  className="
                    absolute right-3 top-1/2 -translate-y-1/2
                    rounded-lg p-2 text-slate-400 transition
                    hover:bg-slate-100 hover:text-slate-700
                  "
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* Remember */}
            {/* <div className="flex items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="
                    h-4 w-4 rounded border-slate-300
                    text-blue-700 accent-[#003274]
                  "
                />
                จดจำการเข้าสู่ระบบ
              </label>

              <button
                type="button"
                className="text-sm font-semibold text-blue-700 hover:underline"
              >
                ลืมรหัสผ่าน?
              </button>
            </div> */}

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="flex w-full justify-center text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="
                flex h-14 w-full items-center justify-center gap-2
                rounded-xl bg-[#073d82] px-5
                text-base font-bold text-white
                shadow-lg shadow-blue-950/15
                transition
                hover:bg-[#002f69]
                focus:outline-none focus:ring-4 focus:ring-blue-200
                disabled:cursor-not-allowed disabled:opacity-60
              "
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                <>
                  <LockKeyhole size={19} />
                  เข้าสู่ระบบ
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              ระบบสามารถใช้งานภายในเครือข่ายของบริษัท
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
