import React, { useState } from "react";
import "./NavBar.css";

export default function NavBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search for:", searchQuery);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Give</h1>
      </div>

      <div className="navbar-search">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search Groups, Tags, or Polls..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <svg
                className="search-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>
        </form>
      </div>

      <div className="navbar-actions">
        <button className="notification-btn">
          <svg
            className="notification-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>

        <div className="user-profile">
          <div className="user-avatar">
            <img
              src="https://via.placeholder.com/40x40/FF6B6B/FFFFFF?text=KS"
              alt="User Avatar"
              className="avatar-image"
            />
          </div>
          <span className="user-name">Kate Smith</span>
        </div>

        <button className="setting-btn">
          <svg className="settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6"></path>
            <path d="m21 12-6 0m-6 0-6 0"></path>
          </svg>
        </button>
      </div>
    </nav>
  );
}
