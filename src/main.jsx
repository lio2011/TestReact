import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './test/test.jsx'

const styles = {
  container: {
    display: 'flex',  // Display the children side by side
    justifyContent: 'space-between',  // Optional: Adds space between the components
    gap: '20px',  // Optional: Adds a gap between the components
  },
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style={styles.container}>
      <App />
    </div>
  </StrictMode>
);


