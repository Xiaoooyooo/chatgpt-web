import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "@/App";
import "@/assets/css/tailwind.css";
import "@/assets/css/theme.scss";
import "@/assets/css/main.css";
import db from "@/database";

db.initialize().then(() => {
  createRoot(document.getElementById("root") as HTMLDivElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
})
