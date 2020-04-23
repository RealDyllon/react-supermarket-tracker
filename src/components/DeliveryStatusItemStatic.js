import React from "react";
import PropTypes from "prop-types";

import {
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaAngleRight,
} from "react-icons/fa";

import Loader from "react-loader-spinner";
import { IconContext } from "react-icons";

const NotAvaliableIcon = () => (
  <IconContext.Provider
    value={{ color: "#f08e38", size: 42, className: "react-icons-icon" }}
  >
    <div style={{ paddingTop: 6.4 }}>
      <FaTimes />
    </div>
  </IconContext.Provider>
);

const AvailableIcon = () => (
  <IconContext.Provider
    value={{ color: "#63d880", size: 42, className: "react-icons-icon" }}
  >
    <div style={{ paddingTop: 6.4 }}>
      <FaCheck />
    </div>
  </IconContext.Provider>
);

const ErrorIcon = () => (
  <IconContext.Provider
    value={{ color: "#e14337", size: 42, className: "react-icons-icon" }}
  >
    <div style={{ paddingTop: 6.4 }}>
      <FaExclamationTriangle />
    </div>
  </IconContext.Provider>
);

const AngleRightIcon = () => (
  <IconContext.Provider
    value={{ color: "grey", size: 42, className: "react-icons-icon" }}
  >
    <div style={{ paddingTop: 6.4 }}>
      <FaAngleRight />
    </div>
  </IconContext.Provider>
);

const DeliveryStatusItemStatic = (props) => {
  return (
    <div
      onClick={() => window.open(props.href, "_blank", "noopener")}
      className="DeliveryStatusItem-Item transition-ease-out-quad"
      style={{
        cursor: "pointer",
        visibility: !props.formSubmitted ? "collapse" : "visible",
        opacity: !props.formSubmitted ? 0 : 1,
      }}
    >
      <div className="left-column">
        <h3 style={{ marginBottom: 0 }}>{props.name}</h3>

        <p style={{ visibility: "hidden", height: 0, margin: 0 }}>
          Delivery Slot Avaliable
        </p>

        <p style={{ display: "inline-block", color: "blue" }}>
          Click to check on {props.site}
        </p>
      </div>
      <div className="right-column">
        <AngleRightIcon />
      </div>
    </div>
  );
};

DeliveryStatusItemStatic.propTypes = {
  formSubmitted: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  site: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
};

export default DeliveryStatusItemStatic;
