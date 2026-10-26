import { createContext, useContext, useState } from "react";

const NavContext = createContext();

function NavContextProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <NavContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </NavContext.Provider>
  );
}

function useNavContext() {
  const context = useContext(NavContext);

  if (context === "undefined")
    return new Error("NavContext was used outside of NavContextProvider!");

  return context;
}

export { NavContextProvider, useNavContext };
