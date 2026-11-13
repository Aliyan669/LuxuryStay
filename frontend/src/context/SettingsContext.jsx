import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api
      .get("/settings")
      .then((res) => {
        setSettings(res.data);
        if (res.data.faviconUrl) {
          let link = document.querySelector("link[rel='icon']");
          if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
          }
          link.href = res.data.faviconUrl;
        }
        if (res.data.hotelName) {
          document.title = res.data.hotelName + " | Luxury Hotel";
        }
      })
      .catch(() => {});
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
