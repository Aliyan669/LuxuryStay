import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "./Icons";

export default function PasswordInput({ placeholder = "Password", ...rest }) {
  const [show, setShow] = useState(false);

  return (
    <div className="pass-wrap">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        {...rest}
      />
      <button
        type="button"
        className="pass-eye"
        onClick={() => setShow(!show)}
        title={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOffIcon size={17} /> : <EyeIcon size={17} />}
      </button>
    </div>
  );
}
