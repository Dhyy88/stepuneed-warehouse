import React, { createContext, useContext } from "react";

const AbilityContext = createContext(null);

export const AbilityProvider = ({ children, ability }) => {
  const isSpv = localStorage.getItem("is_spv") === "true";

  if (isSpv) {
    ability.can([{ actions: "manage", subject: "Pengguna" }]);
    ability.can([{ actions: "manage", subject: "Tambah Cabang" }]);
    ability.can([{ actions: "manage", subject: "Ubah Cabang" }]);
  } else {
    ability.can([{ actions: "read", subject: "Pengguna" }]);
    ability.can([{ actions: "read", subject: "Tambah Cabang" }]);
    ability.can([{ actions: "read", subject: "Ubah Cabang" }]);
  }

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};

export const useAbility = () => {
  const ability = useContext(AbilityContext);

  return ability;
};
