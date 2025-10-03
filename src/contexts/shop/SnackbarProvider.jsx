import { useState, useCallback } from "react";
import { SnackbarContext } from "./SnackbarContext";
import SnackbarStack from "../../components/shop/SnackbarStack";

export function SnackbarProvider({ children }) {
  const [snacks, setSnacks] = useState([]);

  const showSnackbar = useCallback((message, type) => {
    const id = Math.random().toString(36).slice(2,10);
    setSnacks(snacks => [...snacks, { message, id, show: true, type: type || "info" }]);
  }, []);

  const removeSnackbar = useCallback((id) => {
    setSnacks(snacks => snacks.filter(s => s.id !== id));
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <SnackbarStack messages={snacks} removeSnackbar={removeSnackbar} />
    </SnackbarContext.Provider>
  );
}

