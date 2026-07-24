import { isValidElement, useState } from "react";
import Button from "../Buttons/Button";
import Logo from "../Logo/Logo2";
import { FaArrowLeft, FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

export default function CreateAccountModal({ onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
  });

  function onSubmit(data) {
    nextStep();
  }

  function nextStep() {
    setCurrentStep((lastStep) => lastStep + 1);
  }
  function prevStep() {
    setCurrentStep((lastStep) => lastStep - 1);
  }
  function handleContinue() {
    if (currentStep >= 3) {
      navigate("/home");
    } else {
      nextStep();
    }
  }
  const username = watch("username");

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      {/* Header */}
      <div
        className=" flex flex-col w-180 min-h-180 rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-white"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex relative items-center justify-center">
          <button
            type="button"
            className="absolute right-160 bottom-13 cursor-pointer flex h-9 w-9 rounded-full text-4xl bg-black justify-center items-center leading-none hover:bg-neutral-800"
            aria-label="Back"
            onClick={currentStep === 1 ? onClose : prevStep}
          >
            <FaArrowLeft className="text-base" />
          </button>
          <Logo className="w-16" />
        </div>
        {/* Body */}
        <div className="body flex-1">
          {currentStep === 1 && (
            <div className="flex flex-col h-full justify-center items-center">
              <div className="flex items-center justify-center"></div>
              <div>
                <h2 className="flex text-3xl font-bold my-7">
                  When's your birthday?
                </h2>

                <div className="flex gap-2 w-100 h-16">
                  <label className="flex flex-col flex-[1.5] border border-neutral-700 rounded-md px-3 py-2 focus-within:border-sky-500 bg-black">
                    <span className="text-xs text-neutral-500">Month</span>
                    <select
                      defaultValue=""
                      className="bg-black text-white outline-none cursor-pointer "
                    >
                      <option value="" disabled>
                        Month
                      </option>
                      <option value="1">January</option>
                      <option value="2">February</option>
                      <option value="3">March</option>
                      <option value="4">April</option>
                      <option value="5">May</option>
                      <option value="6">June</option>
                      <option value="7">July</option>
                      <option value="8">August</option>
                      <option value="9">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </select>
                  </label>
                  <label
                    className="flex flex-col flex-1 border border-neutral-700
               rounded-md px-3 py-2 focus-within:border-sky-500 bg-black"
                  >
                    <span className="text-xs text-neutral-500">Day</span>
                    <select className="bg-black text-white outline-none cursor-pointer">
                      <option value="" disabled>
                        Day
                      </option>
                      {Array.from({ length: 31 }, (_, index) => (
                        <option key={index + 1} value={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col flex-1 border border-neutral-700 rounded-md px-3 py-2 focus-within:border-sky-500 bg-black">
                    <span className="text-xs text-neutral-500">Year</span>

                    <select
                      defaultValue=""
                      className="bg-black text-white outline-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Year
                      </option>

                      {Array.from(
                        { length: 100 },
                        (_, index) => new Date().getFullYear() - index,
                      ).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <p className="text-neutral-500 mt-5 w-100 text-sm">
                  This will not be shown publicly. Confirm your own age, even if
                  this account is for a business, a pet, or something else.
                </p>
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div className="flex flex-col h-full justify-center items-center">
              <div className="flex flex-col my-7">
                <h2 className="text-white text-3xl font-bold">
                  Set up your account
                </h2>

                <p className="text-neutral-500 my-2">
                  Choose a name, username, and password.
                </p>
                {/* Form */}
                <form id="submit-form" onSubmit={handleSubmit(onSubmit)}>
                  {/* Name */}
                  <div className="w-90 mt-4">
                    <p className="text-neutral-500 my-1 text-sm">Name *</p>
                    <input
                      type="text"
                      placeholder="Name"
                      className="bg-black border border-neutral-700 rounded-md px-3 py-4 w-full text-white placeholder:text-neutral-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      {...register("name", {
                        required: "Name is required.",
                        minLength: {
                          value: 4,
                          message: "Name must contain at least 4 characters.",
                        },
                      })}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  {/* Username */}
                  <div className="w-90 mt-4">
                    <p className="text-neutral-500 mb-2 text-sm">Username *</p>
                    <div className="flex rounded-md border border-neutral-700 bg-black ">
                      <span className=" flex items-center border-r border-neutral-700 px-4 text-neutral-500">
                        @
                      </span>

                      <input
                        type="text"
                        placeholder="Username"
                        required
                        className="bg-black border-l-0 border-neutral-700 rounded-md px-3 py-4 w-full text-white placeholder:text-neutral-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        {...register("username", {
                          required: "Username is required.",
                          minLength: {
                            value: 4,
                            message:
                              "Username must contain at least 4 characters",
                          },
                          pattern: {
                            value: /^[a-zA-Z0-9_]+$/,
                            message:
                              "Use only letters, numbers, and underscores.",
                          },
                        })}
                      />
                    </div>
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.username.message}
                      </p>
                    )}
                    {!errors.username && watch("username") && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-green-500">
                        <FaCheckCircle />
                        <span>Username is available</span>
                      </div>
                    )}
                  </div>
                  {/* Password */}
                  <div className="w-90 my-7">
                    <p className="text-neutral-500 text-sm mb-2">
                      Password (optional)
                    </p>
                    <div className="flex items-center rounded-md border border-neutral-700 bg-black focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="w-full bg-black px-3 py-4 text-white placeholder:text-neutral-500 focus:outline-none"
                        {...register("password", {
                          minLength: {
                            value: 8,
                            message:
                              "Password must contain at least 8 characters.",
                          },
                        })}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((previousValue) => !previousValue)
                        }
                        className="flex h-full items-center justify-center px-4 text-neutral-400 hover:text-white"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.password.message}
                      </p>
                    )}

                    {!errors.password && (
                      <p className="text-neutral-500 text-sm mt-2">
                        At least 8 characters.
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}
          {currentStep === 3 && (
            <div className="flex flex-col h-full justify-start items-center">
              <div className="flex flex-col mt-7">
                <h2 className=" flex  text-white text-4xl font-bold mb-2">
                  Privacy preferences
                </h2>
                <p className="text-neutral-500">
                  Choose your settings before finishing signup.
                </p>

                <div className="flex w-100 items-start justify-between mt-10">
                  <h3>Let people find your account by your email</h3>

                  <label className="relative mt-1 inline-flex shrink-0 cursor-pointer items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="peer sr-only"
                      {...register("findByEmail")}
                    />
                    <div className="h-6 w-11 bg-neutral-700 peer-checked:bg-sky-500 peer-focus:ring-2 peer-focus:ring-sky-400 transition-colors rounded-full"></div>
                    <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </div>
                <div className="w-90">
                  <p className="text-neutral-500">
                    Allow people who have your email adress to find you on X.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="footer flex justify-center items-center pb-3">
          <Button
            type={currentStep === 2 ? "submit" : "button"}
            form={currentStep === 2 ? "submit-form" : undefined}
            onClick={currentStep !== 2 ? handleContinue : undefined}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
