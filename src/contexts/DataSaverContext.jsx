import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-hot-toast";

const STORAGE_KEY = "vaga-beta-data-saver";

const defaultContextValue = {
  isDataSaver: false,
  isAutoDetected: false,
  connectionInfo: {
    effectiveType: null,
    downlink: null,
    saveData: false,
  },
  toggleDataSaver: () => {},
  setDataSaver: () => {},
};

const DataSaverContext = createContext(defaultContextValue);

function getConnectionInfo() {
  if (typeof navigator === "undefined") {
    return {
      effectiveType: null,
      downlink: null,
      saveData: false,
    };
  }

  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  return {
    effectiveType: connection?.effectiveType || null,
    downlink: connection?.downlink ?? null,
    saveData: Boolean(connection?.saveData),
  };
}

function shouldAutoEnableDataSaver(info) {
  const effectiveType = String(info?.effectiveType || "").toLowerCase();
  return effectiveType === "slow-2g" || effectiveType === "2g";
}

export function DataSaverProvider({ children }) {
  const [userPreference, setUserPreference] = useState("auto");
  const [connectionInfo, setConnectionInfo] = useState(() =>
    getConnectionInfo(),
  );
  const notifiedSlowConnection = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (["auto", "on", "off"].includes(parsed?.mode)) {
        setUserPreference(parsed.mode);
      }
    } catch {
      // noop
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ mode: userPreference }),
      );
    } catch {
      // noop
    }
  }, [userPreference]);

  useEffect(() => {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    if (!connection || !connection.addEventListener) {
      return;
    }

    const updateConnection = () => {
      const info = getConnectionInfo();
      setConnectionInfo(info);

      if (
        userPreference === "auto" &&
        shouldAutoEnableDataSaver(info) &&
        !notifiedSlowConnection.current
      ) {
        notifiedSlowConnection.current = true;
        toast("Detektovana spora veza - ukljucena stednja interneta", {
          icon: "📶",
        });
      }
    };

    updateConnection();
    connection.addEventListener("change", updateConnection);

    return () => connection.removeEventListener("change", updateConnection);
  }, [userPreference]);

  const isAutoDetected = userPreference === "auto";
  const isDataSaver =
    userPreference === "on" ||
    (isAutoDetected && shouldAutoEnableDataSaver(connectionInfo));

  const setDataSaver = useCallback((enabled) => {
    setUserPreference(enabled ? "on" : "off");
  }, []);

  const toggleDataSaver = useCallback(() => {
    setUserPreference((prev) => {
      if (prev === "on") return "off";
      return "on";
    });
  }, []);

  const value = useMemo(
    () => ({
      isDataSaver,
      isAutoDetected,
      connectionInfo,
      toggleDataSaver,
      setDataSaver,
    }),
    [
      isDataSaver,
      isAutoDetected,
      connectionInfo,
      toggleDataSaver,
      setDataSaver,
    ],
  );

  return (
    <DataSaverContext.Provider value={value}>
      {children}
    </DataSaverContext.Provider>
  );
}

export function useDataSaver() {
  return useContext(DataSaverContext);
}

export default DataSaverContext;
