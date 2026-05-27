import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './Styles/global.css';

// ⚡ StrictMode removed — it causes double renders in dev and adds overhead
createRoot(document.getElementById('root')).render(<App />);
