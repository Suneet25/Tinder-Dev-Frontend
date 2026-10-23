import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Icon, Input, SegmentedControl } from "../components/common";
import { login, signup } from "../features/user/userSlice";

const EMPTY = { firstName: "", lastName: "", emailId: "", password: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Mirrors validator.isStrongPassword defaults used by the backend
const STRONG_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function validate(form, isSignup) {
  const errors = {};
  if (isSignup) {
    if (form.firstName.trim().length < 4) errors.firstName = "At least 4 characters";
    if (!form.lastName.trim()) errors.lastName = "Required";
  }
  if (!EMAIL_RE.test(form.emailId.trim())) errors.emailId = "Enter a valid email";
  if (!form.password) errors.password = "Enter your password";
  else if (isSignup && !STRONG_RE.test(form.password)) {
    errors.password = "8+ characters with upper and lower case, a number and a symbol";
  }
  return errors;
}

export default function Login() {
  const dispatch = useDispatch();
  const loading = useSelector((s) => s.user.authStatus === "loading");
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const isSignup = mode === "signup";

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((err) => ({ ...err, [key]: undefined }));
  };

  const switchMode = (next) => {
    setMode(next);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form, isSignup);
    setErrors(found);
    if (Object.keys(found).length) return;

    const emailId = form.emailId.trim().toLowerCase();
    if (isSignup) {
      dispatch(signup({ firstName: form.firstName.trim(), lastName: form.lastName.trim(), emailId, password: form.password }));
    } else {
      dispatch(login({ emailId, password: form.password }));
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-6 pt-12 pb-8">
      <div className="flex items-center gap-2.5">
        <span className="flex size-10 items-center justify-center rounded-control bg-primary text-on-primary">
          <Icon name="logo" size={22} strokeWidth={2.2} />
        </span>
        <span className="font-display text-[22px] font-bold tracking-[-0.02em]">Tinder-Dev</span>
      </div>

      <div className="mt-1 flex flex-col gap-2.5">
        <h1 className="heading text-4xl leading-[1.08]">Find your people. For code, gym or more.</h1>
        <p className="text-[15px] leading-relaxed text-muted">One app for coding buddies, gym partners, dates and friends.</p>
      </div>

      <SegmentedControl
        label="Account"
        value={mode}
        onChange={switchMode}
        options={[
          { value: "login", label: "Log in" },
          { value: "signup", label: "Sign up" },
        ]}
      />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {isSignup && (
          <div className="grid grid-cols-2 gap-3">
            <Input label="First name" placeholder="Suneet" autoComplete="given-name" value={form.firstName} onChange={update("firstName")} error={errors.firstName} />
            <Input label="Last name" placeholder="Panigrahi" autoComplete="family-name" value={form.lastName} onChange={update("lastName")} error={errors.lastName} />
          </div>
        )}
        <Input
          label="Email"
          type="email"
          placeholder="you@devmail.com"
          autoComplete="email"
          value={form.emailId}
          onChange={update("emailId")}
          error={errors.emailId}
        />
        <Input
          label="Password"
          type="password"
          placeholder={isSignup ? "At least 8 characters" : "Your password"}
          autoComplete={isSignup ? "new-password" : "current-password"}
          value={form.password}
          onChange={update("password")}
          error={errors.password}
          hint={isSignup ? "Use upper and lower case, a number and a symbol" : undefined}
        />
        <Button type="submit" size="lg" fullWidth loading={loading} className="mt-1">
          {isSignup ? "Create account" : "Log in"}
        </Button>
      </form>
    </div>
  );
}
