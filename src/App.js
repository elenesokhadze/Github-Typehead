import React, {useState, useEffect} from "react";
import "./App.css";

function App() {
   const [searchTerm, setSearchTerm] = useState("");
   const [suggestions, setSuggestions] = useState([]);

   useEffect(() => {
      if (searchTerm.trim() === "") {
         setSuggestions([]);
         return;
      }

      const fetchSuggestions = async () => {
         try {
            const response = await fetch(`https://api.github.com/search/users?q=${searchTerm}`);
            const data = await response.json();

            if (response.ok) {
               const users = data.items.map((user) => ({
                  login: user.login,
                  avatar_url: user.avatar_url,
               }));
               setSuggestions(users);
            } else {
               console.error("Error fetching suggestions:", data.message);
            }
         } catch (error) {
            console.error("Error fetching suggestions:", error);
         }
      };

      fetchSuggestions();
   }, [searchTerm]);

   const handleUserClick = (login) => {
      const githubUrl = `https://github.com/${login}`;
      window.open(githubUrl, "_blank");
   };

   return (
      <div className="app">
         <header className="header">
            <h1>Github Typehead</h1>
            <input
               type="text"
               placeholder="Search GitHub Users"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="search-input"
            />
         </header>
         <main className="main">
            <ul className="suggestions">
               {suggestions.map((user) => (
                  <li key={user.login} onClick={() => handleUserClick(user.login)} className="user-item">
                     <img src={user.avatar_url} alt={`${user.login}'s avatar`} className="avatar" />
                     <span className="username">{user.login}</span>
                  </li>
               ))}
            </ul>
         </main>
      </div>
   );
}

export default App;
