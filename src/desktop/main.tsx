
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import '../index.css'

// Set desktop mode flag
(window as any).DESKTOP_MODE = true;

createRoot(document.getElementById("root")!).render(<App />);
