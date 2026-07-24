import Logo from "../components/Logo/Logo";
import Button from "../components/Buttons/Button";
import { Link } from "react-router-dom";

import { FaGoogle, FaApple, FaPhone } from "react-icons/fa";

export default function Login() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <main className="flex flex-1 flex-col lg:flex-row">
          <section className="flex flex-1 order-2 lg:order-1 items-center justify-center m-10  text-white">
            <div className="flex flex-col gap-10">
              <h1 className="text-5xl text-center lg:text-7xl font-bold whitespace-nowrap md:text-center md:text-5xl sm:text-center sm:text-5xl">
                Happening now.
              </h1>
              <div className="flex flex-col gap-5 items-center lg:items-start">
                <Button icon={<FaPhone />}>Continue with phone</Button>
                <Button icon={<FaGoogle />}>Continue with Google</Button>
                <Button icon={<FaApple />}>Continue with Apple</Button>
                <div className="flex items-center w-90 gap-2">
                  <div className="h-px flex-1 bg-neutral-700"></div>
                  <span className="text-neutral-500 text-sm">or</span>
                  <div className="h-px flex-1 bg-neutral-700"></div>
                </div>
                <div className="w-90">
                  <input
                    type="text"
                    placeholder="Email or username"
                    className="bg-black border border-neutral-700 rounded-md px-3 py-4 w-full text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-400"
                  ></input>
                </div>
                <Button disabled>Continue</Button>
              </div>
              <div className="w-90">
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
              <div className="w-90">
                <p className="text-neutral-500 text-sm text-center">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-white">
                    Create account
                  </Link>
                </p>
              </div>
            </div>
          </section>
          <section className="flex flex-1 order-1 lg:order-2 items-center justify-center">
            <Logo />
          </section>
        </main>
        <footer className=" flex justify-center m-3">
          <nav className="text-center flex flex-row gap-2 text-neutral-400">
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
