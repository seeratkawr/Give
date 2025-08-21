import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as NotificationIcon } from "../assets/notification.svg";
import { ReactComponent as SettingsIcon } from "../assets/settings.svg";

function NavBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // 🔎 Fetch search results with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/search?q=${encodeURIComponent(
            searchQuery
          )}`
        );
        const data = await res.json();

        const suggestions = data.map((item) => {
          let label = "";
          let url = "#";

          switch (item.type) {
            case "groups":
              label = item.name;
              url = `/groups&id=${item.id}`;
              break;
            case "posts":
              label =
                item.content?.slice(0, 50) +
                (item.content?.length > 50 ? "..." : "");
              url = `/posts&id=${item.id}`;
              break;
            case "users":
              label = `${item.firstName} ${item.lastName}`;
              url = `/users&id=${item.id}`;
              break;
            default:
              label = "Unknown";
          }

          return { label, url };
        });

        setFilteredSuggestions(suggestions);
        setShowDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex items-center relative h-[90px]">
      {/* Brand */}
      <div className="cursor-pointer w-[27%] flex justify-start">
        <h1 className="text-defaultYellow text-4xl font-bold font-header">
          Give
        </h1>
      </div>

      {/* Search + Notifications */}
      <div className="w-[46%] flex gap-4">
        <div className="w-full max-w-[500px]" ref={dropdownRef}>
          <div className="relative flex items-center w-full py-1 pl-5 pr-2 rounded-full bg-darkGrey">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Groups, Tags, or Users..."
              className="w-full text-base bg-darkGrey placeholder-black/40 outline-none"
            />

            {/* Dropdown */}
            {showDropdown && (
              <ul className="absolute left-0 right-0 mt-2 bg-backgroundGrey border border-gray-300 rounded-[1rem] shadow-md max-h-60 overflow-y-auto z-50">
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((s, i) => (
                    <li
                      key={i}
                      className="px-3 py-2 text-left group hover:bg-gray-100"
                    >
                      <Link
                        to={s.url}
                        className="text-base text-gray-700 group-hover:text-black"
                      >
                        {s.label}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-gray-500">No results found</li>
                )}
              </ul>
            )}

            {/* Search button */}
            <button
              type="button"
              className="right-2 p-2 rounded-full flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 stroke-2 text-black opacity-60 hover:opacity-100"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Notification Button */}
        <button className="p-2.5 rounded-full flex items-center justify-center bg-darkGrey">
          <NotificationIcon className="w-6 h-6 stroke-2 text-gray-600" />
        </button>
      </div>

      {/* User profile + settings */}
      <div className="flex items-center gap-4 w-[27%] justify-end">
        <div className="flex items-center gap-2 cursor-pointer rounded-[25px]">
          <div className="w-[45px] h-[45px]">
            <img
              src="https://placehold.co/600x400.png"
              alt="User Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <span className="font-medium text-gray-700 text-lg">Kate Smith</span>
        </div>

        <button className="rounded-full flex items-center justify-center">
          <SettingsIcon className="w-10 h-10" />
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
