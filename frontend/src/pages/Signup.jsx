import Logo from "../components/Logo/Logo";
import Button from "../components/Buttons/Button";
import { Link } from "react-router-dom";

import { FaGoogle, FaApple, FaPhone } from "react-icons/fa";
import { useState } from "react";
import CreateAccountModal from "../components/Modals/CreateAccountModal";

export default function Signup() {
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
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
                <Button icon={<FaGoogle />}>Sign up with Google</Button>
                <Button icon={<FaApple />}>Sign up with Apple</Button>
                <div className="flex items-center w-90 gap-2">
                  <div className="h-px flex-1 bg-neutral-700"></div>
                  <span className="text-neutre-500 text-sm">or</span>
                  <div className="h-px flex-1 bg-neutral-700"></div>
                </div>
                <Button onClick={() => setShowCreateAccountModal(true)}>
                  Create account
                </Button>
                {showCreateAccountModal && (
                  <CreateAccountModal
                    onClose={() => setShowCreateAccountModal(false)}
                  />
                )}
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
                  Have an account already?{" "}
                  <Link to="/Login" className="text-white">
                    Log in
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
