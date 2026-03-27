"use client";
import { useState, useEffect } from "react";

type CreatePasswordProps = {
  password: string;
  isComplete: (val: boolean) => void;
};
const CreatePasswordRules = ({
  password,
  isComplete,
}: CreatePasswordProps) => {
  const [rulesStatus, setRulesStatus] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    specialChar: false,
  });

  useEffect(() => {
    setRulesStatus({
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digit: /\d/.test(password),
      specialChar: /[!@#$%^&*()_+{}\[\]:;"'<>,.?/\\|-]/.test(password),
    });
  }, [password]);
  useEffect(() => {
    const allRulesMet = Object.values(rulesStatus).every((status) => status);
    isComplete(allRulesMet);
  }, []);

return (
  <div>
    <p className={`${rulesStatus.minLength ? "text-green-500" : "text-red-400"} text-[0.8rem]`}>
      Password must have at least 8 characters.
    </p>

    <p className={`${rulesStatus.uppercase ? "text-green-500" : "text-red-400"} text-[0.8rem]`}>
      1 uppercase letter
    </p>

    <p className={`${rulesStatus.lowercase ? "text-green-500" : "text-red-400"} text-[0.8rem]`}>
      1 lowercase letter
    </p>

    <p className={`${rulesStatus.digit ? "text-green-500" : "text-red-400"} text-[0.8rem]`}>
      1 digit
    </p>

    <p className={`${rulesStatus.specialChar ? "text-green-500" : "text-red-400"} text-[0.8rem]`}>
      1 special character
    </p>
  </div>
);
};

export default CreatePasswordRules;
