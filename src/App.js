import React, { useState, useEffect, useRef } from "react";
import Card from "./Card"; // Assuming Card component is already defined
import "./App.css";
import DisplayIcon from "./icons_FEtask/Display.svg"; // Import your SVG icon
import AddIcon from "./icons_FEtask/add.svg";
import dotMenuIcon from "./icons_FEtask/3 dot menu.svg";
import BacklogIcon from "./icons_FEtask/Backlog.svg";
import TodoIcon from "./icons_FEtask/To-do.svg";
import InProgressIcon from "./icons_FEtask/in-progress.svg";
import DoneIcon from "./icons_FEtask/Done.svg";
import CancelledIcon from "./icons_FEtask/Cancelled.svg";
import DownIcon from "./icons_FEtask/down.svg";
// Import your priority icons
import NoPriorityIcon from "./icons_FEtask/No-priority.svg";
import LowPriorityIcon from "./icons_FEtask/Img - Low Priority.svg";
import MediumPriorityIcon from "./icons_FEtask/Img - Medium Priority.svg";
import HighPriorityIcon from "./icons_FEtask/Img - High Priority.svg";
import UrgentPriorityIcon from "./icons_FEtask/SVG - Urgent Priority colour.svg";
import userIcon from "./icons_FEtask/add.svg";

function App() {
  const [tickets, setTickets] = useState([]); // Initialize with empty array
  const [users, setUsers] = useState([]); // Initialize with empty array
  const [groupBy, setGroupBy] = useState("Status");
  const [orderBy, setOrderBy] = useState("Priority");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Define priority headings
  const priorityHeadings = [
    { label: "No priority", level: 0 },
    { label: "Urgent", level: 4 },
    { label: "High", level: 3 },
    { label: "Medium", level: 2 },
    { label: "Low", level: 1 },
  ];

  // Define a mapping for priority icons
  const priorityIcons = {
    0: NoPriorityIcon,
    1: LowPriorityIcon,
    2: MediumPriorityIcon,
    3: HighPriorityIcon,
    4: UrgentPriorityIcon,
  };

  // Status headings for columns
  const statusHeadings = ["Backlog", "Todo", "In progress", "Done", "Canceled"];
  // Status headings for icons
  const statusIcons = {
    Backlog: BacklogIcon,
    Todo: TodoIcon,
    "In progress": InProgressIcon,
    Done: DoneIcon,
    Canceled: CancelledIcon,
  };

  useEffect(() => {
    // Load saved state from localStorage
    const savedGrouping = localStorage.getItem("groupBy");
    const savedOrdering = localStorage.getItem("orderBy");
    if (savedGrouping) setGroupBy(savedGrouping);
    if (savedOrdering) setOrderBy(savedOrdering);
  }, []);

  useEffect(() => {
    // Save state to localStorage
    localStorage.setItem("groupBy", groupBy);
    localStorage.setItem("orderBy", orderBy);
  }, [groupBy, orderBy]);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.quicksell.co/v1/internal/frontend-assignment"
        ); // Replace with your actual API link
        const data = await response.json();

        if (data.tickets && data.users) {
          const updatedTickets = data.tickets.map((ticket) => {
            const user = data.users.find((u) => u.id === ticket.userId);
            return {
              ...ticket,
              user: {
                name: user.name,
                avatar: "https://via.placeholder.com/30",
              },
            };
          });
          setTickets(updatedTickets);
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  // Group tickets based on selected grouping (Status, User, or Priority)
  const groupedTickets = tickets.reduce((acc, ticket) => {
    const groupKey =
      groupBy === "Status"
        ? ticket.status
        : groupBy === "User"
        ? ticket.user.name
        : ticket.priority; // Use numeric priority directly
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(ticket);
    return acc;
  }, {});

  // Sort tickets in each group based on ordering (Priority or Title)
  const sortedGroupedTickets =
    groupBy === "Status"
      ? statusHeadings.reduce((acc, status) => {
          const sortedTickets = groupedTickets[status] || []; // Ensure empty array if no tickets for a status
          acc[status] = sortedTickets.sort((a, b) => {
            if (orderBy === "Priority") {
              return b.priority - a.priority;
            } else {
              return a.title.localeCompare(b.title);
            }
          });
          return acc;
        }, {})
      : Object.keys(groupedTickets).reduce((acc, groupKey) => {
          const sortedTickets = [...groupedTickets[groupKey]].sort((a, b) => {
            if (orderBy === "Priority") {
              return a.priority - b.priority;
            } else {
              return a.title.localeCompare(b.title);
            }
          });
          acc[groupKey] = sortedTickets;
          return acc;
        }, {});

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="app">
      <div className="dropdown" ref={dropdownRef}>
        <button
          className="dropdown-button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <img src={DisplayIcon} alt="Display" className="display-icon" />
          Display
          <img src={DownIcon} alt="Down" className="down-icon" />
        </button>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-option">
              <label>Grouping</label>
              <div className="select-container">
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                >
                  <option value="Status">Status</option>
                  <option value="User">User</option>
                  <option value="Priority">Priority</option>
                </select>
              </div>
            </div>
            <div className="dropdown-option">
              <label>Ordering</label>
              <div className="select-container">
                <select
                  value={orderBy}
                  onChange={(e) => setOrderBy(e.target.value)}
                >
                  <option value="Priority">Priority</option>
                  <option value="Title">Title</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="columns-container">
        {Object.keys(sortedGroupedTickets).map((groupKey) => {
          // Determine the label for groupKey if grouping by priority
          const groupLabel =
            groupBy === "Priority"
              ? priorityHeadings.find((p) => p.level === parseInt(groupKey))
                  .label
              : groupKey; // Use groupKey directly for Status and User
          return (
            <div className="column" key={groupKey}>
              <div className="column-header">
                <h4 className="column-title">
                  {groupBy === "Status" && statusIcons[groupLabel] && (
                    <img
                      src={statusIcons[groupLabel]}
                      alt={`${groupLabel} icon`}
                      style={{ marginRight: "8px" }}
                    />
                  )}
                  {groupBy === "Priority" && priorityIcons[groupKey] && (
                    <img
                      src={priorityIcons[groupKey]}
                      alt={`${groupKey} priority icon`}
                      style={{ marginRight: "8px" }}
                    />
                  )}
                  {/* {groupBy === "User" && (
                    // <img
                    //   src={"path/to/user/icon.svg"} // Update with your user icon path
                    //   alt={`${groupKey} user icon`}
                    //   style={{ marginRight: "8px" }}
                    // />
                    <img
                      src={"https://via.placeholder.com/30"}
                      alt="user-avatar"
                      className="avatar"
                      style={{ marginRight: "8px" }}
                    />
                  )} */}
                  {groupLabel}{" "}
                  <span className="card-count">
                    ({sortedGroupedTickets[groupKey].length})
                  </span>
                </h4>
                <div className="column-buttons">
                  <button className="column-button">
                    <img src={AddIcon} alt="Icon 1" />
                  </button>
                  <button className="column-button">
                    <img src={dotMenuIcon} alt="Icon 2" />
                  </button>
                </div>
              </div>
              <div className="cards-container">
                {sortedGroupedTickets[groupKey].map((ticket) => (
                  <Card key={ticket.id} {...ticket} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
