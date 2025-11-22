import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WalletProvider } from "./contexts/WalletContext";
import { PollProvider } from "./contexts/PollContext";

createRoot(document.getElementById("root")!).render(
  <WalletProvider>
    <PollProvider>
      <App />
    </PollProvider>
  </WalletProvider>
);
