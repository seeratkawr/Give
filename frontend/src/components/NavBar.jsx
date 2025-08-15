import React, { useState } from "react";
import "./NavBar.css";
import { ReactComponent as NotificationIcon } from "../assets/notification.svg";
import { ReactComponent as SettingsIcon } from "../assets/settings.svg";

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

      {/* Group search bar + notification button */}
      <div className="navbar-center">
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

        <button className="notification-btn">
          <NotificationIcon className="notification-icon" />
        </button>
      </div>

      <div className="navbar-actions">
        <div className="user-profile">
          <div className="user-avatar">
            <img
              src="https://placehold.co/600x400.png"
              alt="User Avatar"
              className="avatar-image"
            />
          </div>
          <span className="user-name">Kate Smith</span>
        </div>

        <button className="settings-btn">
          <SettingsIcon className="settings-icon" />
        </button>
      </div>
    </nav>
  );
}
