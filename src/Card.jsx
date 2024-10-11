import React, { useState } from "react";
import "./Card.css";
import PriorityIcon from "./icons_FEtask/No-priority.svg"; // Import your SVG file for priority icon
import NoPriorityIcon from "./icons_FEtask/No-priority.svg";
import LowPriorityIcon from "./icons_FEtask/Img - Low Priority.svg";
import MediumPriorityIcon from "./icons_FEtask/Img - Medium Priority.svg";
import HighPriorityIcon from "./icons_FEtask/Img - High Priority.svg";
import UrgentPriorityIcon from "./icons_FEtask/SVG - Urgent Priority colour.svg";

const Card = ({ id, title, tag, user, status, priority }) => {
  const [isPriorityHovered, setPriorityHovered] = useState(false);
  const [isUserHovered, setUserHovered] = useState(false);
  // Define a mapping for priority icons
  const priorityIcons = {
    0: NoPriorityIcon,
    1: LowPriorityIcon,
    2: MediumPriorityIcon,
    3: HighPriorityIcon,
    4: UrgentPriorityIcon,
  };

  // Define a mapping for priority descriptions
  const priorityDescriptions = {
    0: "No Priority",
    1: "Low Priority",
    2: "Medium Priority",
    3: "High Priority",
    4: "Urgent Priority",
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-id">{id}</span>
        <div
          className="user-avatar"
          onMouseEnter={() => setUserHovered(true)}
          onMouseLeave={() => setUserHovered(false)}
        >
          <img src={user.avatar} alt="user-avatar" className="avatar" />
          {isUserHovered && <span className="tooltip">{user.name}</span>}
        </div>
      </div>
      <div className="card-title">{title}</div>

      {/* Footer section for priority and tags */}
      <div className="card-footer">
        <div
          className="priority-icon-container"
          onMouseEnter={() => setPriorityHovered(true)}
          onMouseLeave={() => setPriorityHovered(false)}
        >
          <img
            src={priorityIcons[priority]} // Use the mapping to get the correct icon
            alt="priority-icon"
            className="priority-icon"
          />

          {isPriorityHovered && (
            <span className="tooltip-priority">
              {priorityDescriptions[priority]}
            </span>
          )}
        </div>
        <div className="tags-container">
          {tag.map(
            (
              tag,
              index // Updated 'tags' to 'tag'
            ) => (
              <span key={index} className="tag">
                {tag}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
