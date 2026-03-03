import { useState } from "react";

export const usePasswordVisible = () => {
  const [visiblePassword, setVisiblePassword] = useState({
    password: false,
  });

  const handleVisiblePassword = (key: "password") => {
    setVisiblePassword({
      ...visiblePassword,
      [key]: !visiblePassword[key],
    });
  };
  return {
    visiblePassword,
    handleVisiblePassword,
  };
};
