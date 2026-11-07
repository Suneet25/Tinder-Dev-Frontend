import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, IconButton, Input, Select, Tag } from "../components/common";
import { useToast } from "../features/toast/useToast";
import { updateProfile } from "../features/user/userSlice";

const MAX_HOBBIES = 10;
const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const toForm = (u) => ({
  firstName: u.firstName ?? "",
  lastName: u.lastName ?? "",
  emailId: u.emailId ?? "",
  age: u.age ?? "",
  gender: u.gender ?? "",
  hobbies: u.hobbies ?? [],
});

export default function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notify = useToast();
  const user = useSelector((s) => s.user.data);
  const saving = useSelector((s) => s.user.saveStatus === "loading");
  const [form, setForm] = useState(() => toForm(user));
  const [hobbyDraft, setHobbyDraft] = useState("");
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const addHobby = () => {
    const value = hobbyDraft.trim();
    if (!value) return;
    if (form.hobbies.length >= MAX_HOBBIES) return notify.warning(`You can add up to ${MAX_HOBBIES} interests.`);
    if (form.hobbies.some((h) => h.toLowerCase() === value.toLowerCase())) return notify.info(`"${value}" is already on your list.`);
    setForm((f) => ({ ...f, hobbies: [...f.hobbies, value] }));
    setHobbyDraft("");
  };

  const removeHobby = (h) => setForm((f) => ({ ...f, hobbies: f.hobbies.filter((x) => x !== h) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = {};
    if (form.firstName.trim().length < 4) found.firstName = "At least 4 characters";
    if (form.age !== "" && Number(form.age) < 18) found.age = "Must be 18 or older";
    setErrors(found);
    if (Object.keys(found).length) return;

    // Only send fields that changed (the API rejects unknown keys)
    const next = { ...form, firstName: form.firstName.trim(), lastName: form.lastName.trim(), emailId: form.emailId.trim(), age: form.age === "" ? undefined : Number(form.age) };
    const original = toForm(user);
    const changes = Object.fromEntries(
      Object.entries(next).filter(([k, v]) => v !== undefined && JSON.stringify(v) !== JSON.stringify(original[k])),
    );
    if (Object.keys(changes).length === 0) {
      notify.info("Nothing to save.");
      return navigate("/profile");
    }

    const result = await dispatch(updateProfile(changes));
    if (updateProfile.fulfilled.match(result)) navigate("/profile");
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-bg lg:max-w-2xl lg:py-4">
      <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-2 bg-bg px-4 py-3">
          <IconButton as={Link} to="/profile" icon="back" label="Back to profile" variant="ghost" />
          <h1 className="heading text-lg">Edit profile</h1>
          <Button type="submit" size="sm" loading={saving}>
            Save
          </Button>
        </header>

        <div className="flex flex-col gap-5 px-5 pt-5 pb-8">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First name" value={form.firstName} onChange={set("firstName")} error={errors.firstName} autoComplete="given-name" />
            <Input label="Last name" value={form.lastName} onChange={set("lastName")} autoComplete="family-name" />
          </div>
          <Input label="Email" type="email" value={form.emailId} onChange={set("emailId")} autoComplete="email" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Age" type="number" min={18} inputMode="numeric" value={form.age} onChange={set("age")} error={errors.age} />
            <Select label="Gender" value={form.gender} onChange={set("gender")} options={GENDERS} placeholder="Prefer not to say" />
          </div>

          <fieldset className="flex flex-col gap-2.5">
            <legend className="mb-2.5 text-[13px] font-medium text-muted">
              Interests &amp; skills ({form.hobbies.length}/{MAX_HOBBIES})
            </legend>
            <div className="flex flex-wrap gap-2">
              {form.hobbies.map((h) => (
                <Tag key={h} onRemove={() => removeHobby(h)}>
                  {h}
                </Tag>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                aria-label="Add an interest"
                placeholder="Node.js, Running, Chess…"
                value={hobbyDraft}
                onChange={(e) => setHobbyDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addHobby();
                  }
                }}
              />
              <Button variant="soft" className="h-12" onClick={addHobby} disabled={!hobbyDraft.trim()}>
                Add
              </Button>
            </div>
          </fieldset>
        </div>
      </form>
    </div>
  );
}
