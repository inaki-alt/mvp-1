import React from "react";
import {
  FiAtSign,
  FiBell,
  FiCalendar,
  FiLifeBuoy,
  FiMoreVertical,
  FiSettings,
  FiTrash,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const CardHeader = ({ title }) => {
  return (
    <div className="card-header">
      <h5 className="card-title">{title}</h5>
    </div>
  );
};

export default CardHeader;
