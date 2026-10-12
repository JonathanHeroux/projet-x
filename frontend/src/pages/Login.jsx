import Logo from "../components/Logo/Logo";
import Button from "../components/Buttons/Button";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaGoogle, FaApple, FaPhone } from "react-icons/fa";
import { apiFetch } from "../services/api";

export default function Login() {
  // const [content, setContent] = useState("");
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    setLoginError("");

    try {
      const response = await apiFetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setLoginError("Invalid username or password.");
        } else {
          setLoginError("Unable to log in. Please try again.");
        }
        return;
      }

      navigate("/home");
    } catch (error) {
      setLoginError("Unable to connect to the server.");
    }
  }
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <main className="flex flex-1 flex-col lg:flex-row">
          {/* Login section */}
          <section className="flex min-w-0 flex-1 order-2 lg:order-1 items-center justify-center mx-4 my-10 lg:m-10 text-white">
            <div className="flex w-full max-w-90 flex-col gap-10">
              <h1 className="text-4xl text-center font-bold sm:text-5xl lg:text-7xl">
                Happening now.
              </h1>
              {/* Authentication options */}
              <form
                className="flex flex-col gap-5 items-center lg:items-start"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Button icon={<FaPhone />}>Continue with phone</Button>
                <Button icon={<FaGoogle />}>Continue with Google</Button>
                <Button icon={<FaApple />}>Continue with Apple</Button>
                <div className="flex items-center w-full max-w-90 gap-2">
                  <div className="h-px flex-1 bg-neutral-700"></div>
                  <span className="text-neutral-500 text-sm">or</span>
                  <div className="h-px flex-1 bg-neutral-700"></div>
                </div>
                {/* Username or email input */}
                <div className="w-full max-w-90">
                  <input
                    type="text"
                    {...register("username", {
                      required: "Email or username is required.",
                    })}
                    placeholder="Email or username"
                    className="bg-black border border-neutral-700 rounded-md px-3 py-4 w-full text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-400"
                  ></input>
                </div>
                {errors.username && (
                  <p className="text-red-500 text-sm">
                    {errors.username.message}
                  </p>
                )}

                {/* Password input */}
                <div className="w-full max-w-90">
                  <input
                    type="password"
                    {...register("password", {
                      required: "Password is required.",
                    })}
                    placeholder="Password"
                    autoComplete="current-password"
                    className="bg-black border border-neutral-700 rounded-md px-3 py-4 w-full text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-400"
                  ></input>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
                {/* Authentication error */}
                {loginError && (
                  <p
                    role="alert"
                    className="w-full max-w-90 text-sm text-red-500"
                  >
                    {loginError}
                  </p>
                )}

                <Button type="submit">Continue</Button>
              </form>
              {/* Legal information */}
              <div className="w-full max-w-90">
                <p className="text-neutral-500 text-sm text-center ">
                  By continuing, you agree to our{" "}
                  <a href="#" className="text-white">
                    Terms of service
                  </a>
                  ,{" "}
                  <a href="#" className="text-white">
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-white">
                    Cookie Use
                  </a>
                  .
                </p>
              </div>
              {/* Account registration link */}
              <div className="w-full max-w-90">
                <p className="text-neutral-500 text-sm text-center">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-white">
                    Create account
                  </Link>
                </p>
              </div>
            </div>
          </section>
          {/* Branding section */}
          <section className="flex flex-1 order-1 lg:order-2 items-center justify-center">
            <Logo />
          </section>
        </main>
        {/* Footer navigation */}
        <footer className=" flex justify-center m-3">
          <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-neutral-400 text-xs sm:text-sm">
            <Link to="/About">About</Link>
            <div>.</div>
            <Link to="/GetApp">Get App</Link>
            <div>.</div>
            <Link to="/Grok">Grok</Link>
            <div>.</div>
            <Link to="/Help">Help</Link>
            <div>.</div>
            <Link to="/Terms">Terms</Link>
            <div>.</div>
            <Link to="/Privacy">Privacy</Link>
            <div>.</div>
            <Link to="/Cookies">Cookies</Link>
            <div>.</div>
            <Link to="/Careers">Careers</Link>
            <div>.</div>
            <Link to="/Ads&Business">Ads & Business</Link>
            <div>.</div>
            <Link to="/Developers">Developers</Link>
            <div>.</div>
            <Link to="/News">News</Link>
            <div>.</div>
            <Link to="/Accessibility">Accessibility</Link>
            <div>.</div>
            <p>© {new Date().getFullYear()} X Corp.</p>
          </nav>
        </footer>
      </div>
    </>
  );
}
