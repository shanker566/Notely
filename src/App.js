import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRouter from './routes/AppRouter';
import './App.css'; 

// 1. Create the Theme Context
export const ThemeContext = React.createContext();

function App() {
  // 2. State to hold the current theme ('dark' or 'light')
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'dark'
  );

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme(currentTheme => {
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  // 3. Effect to apply the theme class to the body tag
  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-mode' : '';
  }, [theme]);

  return (
    // 4. Provide the theme state and toggle function to the rest of the app
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <AppRouter />
        </main>
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;