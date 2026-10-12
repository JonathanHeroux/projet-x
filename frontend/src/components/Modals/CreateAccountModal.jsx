import { useState } from "react";
import Button from "../Buttons/Button";
import Logo from "../Logo/Logo2";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../services/api";

// Manage the multi-step account creation flow
export default function CreateAccountModal({ onClose }) {
  // Store the current signup step
  const [currentStep, setCurrentStep] = useState(1);
  // Control the password visibility
  const [showPassword, setShowPassword] = useState(false);
  // Store the signup error message returned by the API
  const [signupError, setSignupError] = useState("");
  const navigate = useNavigate();

  // Manage form registration, validation and errors
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  // Handle validation and progression through the signup steps
  async function onSubmit(data) {
    if (currentStep === 1) {
      const year = Number(data.birthYear);
      const month = Number(data.birthMonth);
      const day = Number(data.birthDay);

      const birthDate = new Date(Date.UTC(year, month - 1, day));

      const isValidDate =
        birthDate.getUTCFullYear() === year &&
        birthDate.getUTCMonth() === month - 1 &&
        birthDate.getUTCDate() === day &&
        birthDate <= new Date();

      if (!isValidDate) {
        setSignupError("Please enter a valid birth date.");
        return;
      }

      setSignupError("");
      nextStep();
      return;
    }

    if (currentStep === 2) {
      try {
        const response = await apiFetch(
          `/username-available?username=${encodeURIComponent(data.username)}`,
        );

        const result = await response.json();

        if (!response.ok) {
          setSignupError(result.error || "Unable to verify username.");
          return;
        }

        if (!result.available) {
          setSignupError("Username is already taken.");
          return;
        }

        setSignupError("");
        nextStep();
      } catch {
        setSignupError("Unable to connect to the server.");
      }

      return;
    }

    if (currentStep === 3) {
      const birthDate = [
        data.birthYear,
        data.birthMonth.padStart(2, "0"),
        data.birthDay.padStart(2, "0"),
      ].join("-");

      try {
        const response = await apiFetch("/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            username: data.username,
            password: data.password,
            birth_date: birthDate,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          setSignupError(result.error || "Unable to create account.");
          return;
        }

        navigate("/home");
      } catch {
        setSignupError("Unable to connect to the server.");
      }
    }
  }
  // Move forward in the signup process
  function nextStep() {
    setCurrentStep((lastStep) => lastStep + 1);
  }
  // Move backward in the signup process
  function prevStep() {
    setCurrentStep((lastStep) => lastStep - 1);
  }

  // Render the modal directly into the document body
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black p-2 sm:p-4"
      onClick={onClose}
    >
      {/* Header */}
      <div
        className={`flex w-full max-w-180 flex-col rounded-2xl border border-neutral-800 bg-neutral-900 p-4 text-white sm:p-8 ${
          currentStep === 2
            ? "h-auto max-h-[95dvh] overflow-y-auto"
            : "h-140 max-h-[90dvh] overflow-hidden md:h-auto md:min-h-180"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex relative items-center justify-center">
          <button
            type="button"
            className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer flex h-9 w-9 rounded-full text-4xl bg-black justify-center items-center leading-none hover:bg-neutral-800"
            aria-label="Back"
            onClick={currentStep === 1 ? onClose : prevStep}
          >
            <FaArrowLeft className="text-base" />
          </button>
          <Logo className="w-16" />
        </div>{" "}
        {/* One form for all signup steps */}
        <form
          id="submit-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* Body */}
          <div className="min-h-0 flex-1">
            {/* Step 1: Collect the user's birth date */}
            {currentStep === 1 && (
              <div className="flex w-full min-w-0 flex-col h-full items-center justify-center">
                <div className="flex items-center justify-center"></div>
                <div className="w-full max-w-100 min-w-0">
                  <h2 className="text-2xl sm:text-3xl font-bold my-7">
                    When's your birthday?
                  </h2>

                  <div className="flex w-full min-w-0 gap-2 h-16">
                    <label className="flex min-w-0 flex-col flex-[1.5] border border-neutral-700 rounded-md px-3 py-2 focus-within:border-sky-500 bg-black">
                      <span className="text-xs text-neutral-500">Month</span>
                      {/* Register the selected birth month */}
                      <select
                        defaultValue=""
                        className="bg-black text-white outline-none w-full min-w-0 cursor-pointer "
                        {...register("birthMonth", {
                          required: "Birth month is required.",
                        })}
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
                      className="flex flex-col min-w-0 flex-1 border border-neutral-700
               rounded-md px-3 py-2 focus-within:border-sky-500 bg-black"
                    >
                      <span className="text-xs text-neutral-500">Day</span>
                      {/* Register the selected birth day */}
                      <select
                        defaultValue=""
                        className="bg-black text-white outline-none  w-full min-w-0 cursor-pointer"
                        {...register("birthDay", {
                          required: "Birth day is required.",
                        })}
                      >
                        <option value="" disabled>
                          Day
                        </option>
                        {/* Generate the 31 available days */}
                        {Array.from({ length: 31 }, (_, index) => (
                          <option key={index + 1} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col min-w-0 flex-1 border border-neutral-700 rounded-md px-3 py-2 focus-within:border-sky-500 bg-black">
                      <span className="text-xs text-neutral-500">Year</span>
                      {/* Register the selected birth year */}
                      <select
                        defaultValue=""
                        className="bg-black text-white outline-none w-full min-w-0 cursor-pointer"
                        {...register("birthYear", {
                          required: "Birth year is required.",
                        })}
                      >
                        <option value="" disabled>
                          Year
                        </option>

                        {/* Generate the last 100 years from the current year */}
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
                    {(errors.birthMonth ||
                      errors.birthDay ||
                      errors.birthYear ||
                      signupError) && (
                      <p className="mt-2 text-sm text-red-500">
                        {signupError || "Please complete your birth date."}
                      </p>
                    )}
                  </div>
                  <p className="text-neutral-500 mt-5 w-full text-sm">
                    This will not be shown publicly. Confirm your own age, even
                    if this account is for a business, a pet, or something else.
                  </p>
                </div>
              </div>
            )}
            {/* Step 2: Collect and validate the account credentials */}
            {currentStep === 2 && (
              <div className="flex w-full min-w-0 flex-col items-center justify-center">
                <div className="flex w-full max-w-90 flex-col py-2">
                  <h2 className="text-white text-2xl sm:text-3xl font-bold">
                    Set up your account
                  </h2>

                  <p className="text-neutral-500 my-2">
                    Choose a name, username, and password.
                  </p>

                  {/* Name */}
                  <div className="w-full mt-4">
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
                  <div className="w-full mt-4">
                    <p className="text-neutral-500 mb-2 text-sm">Username *</p>
                    <div className="flex rounded-md border border-neutral-700 bg-black">
                      <span className="flex items-center border-r border-neutral-700 px-4 text-neutral-500">
                        @
                      </span>

                      <input
                        type="text"
                        placeholder="Username"
                        required
                        className="min-w-0 bg-black border-l-0 border-neutral-700 rounded-md px-3 py-4 w-full text-white placeholder:text-neutral-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        {...register("username", {
                          onChange: () => setSignupError(""),
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
                    {signupError && (
                      <p className="mt-1 text-sm text-red-500">{signupError}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="w-full mt-4">
                    <p className="text-neutral-500 text-sm mb-2">Password</p>
                    <div className="flex items-center rounded-md border border-neutral-700 bg-black focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="min-w-0 w-full bg-black px-3 py-4 text-white placeholder:text-neutral-500 focus:outline-none"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message:
                              "Password must contain at least 8 characters.",
                          },
                        })}
                      />

                      {/* Toggle between visible and hidden password */}
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
                </div>
              </div>
            )}
            {/* Step 3: Configure the account privacy preferences */}
            {currentStep === 3 && (
              <div className="flex w-full min-w-0 flex-col h-full justify-start items-center">
                <div className="flex w-full max-w-100 min-w-0 flex-col mt-7">
                  <h2 className="text-white text-2xl sm:text-4xl font-bold mb-2">
                    Privacy preferences
                  </h2>
                  <p className="text-neutral-500">
                    Choose your settings before finishing signup.
                  </p>

                  <div className="flex w-full min-w-0 items-start justify-between gap-3 mt-10">
                    <h3 className="min-w-0">
                      Let people find your account by your email
                    </h3>

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
                  <div className="w-full max-w-90">
                    <p className="text-neutral-500">
                      Allow people who have your email adress to find you on X.
                    </p>
                  </div>
                </div>
                {signupError && (
                  <p className="mt-2 text-sm text-red-500">{signupError}</p>
                )}
              </div>
            )}
          </div>
          {/* Footer */}
          <div className="footer mt-auto flex shrink-0 flex-col justify-center items-center pt-4 pb-3">
            {/* Submit step 2 through the form, otherwise control navigation directly */}
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
