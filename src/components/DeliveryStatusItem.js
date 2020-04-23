import React from "react";
import PropTypes from "prop-types";

import { FaCheck, FaTimes, FaExclamationTriangle } from "react-icons/fa";

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

const DeliveryStatusItem = (props) => {
  return (
    <div
      className="DeliveryStatusItem-Item transition-ease-out-quad"
      style={{
        visibility: !props.formSubmitted ? "collapse" : "visible",
        opacity: !props.formSubmitted ? 0 : 1,
      }}
    >
      <div className="left-column">
        <h3 style={{ marginBottom: 0 }}>{props.name}</h3>

        <p style={{ visibility: "hidden", height: 0, margin: 0 }}>
          Delivery Slot Avaliable
        </p>

        {props.loading ? (
          <p>Checking timetables...</p>
        ) : props.error ? (
          props.error // return the error text
        ) : props.res ? (
          props.dataCheck ? (
            <p>Delivery Avaliable!</p>
          ) : (
            <p>Delivery Unvailable</p>
          )
        ) : (
          <p>Internal error: props.res is falsy!</p>
        )}
      </div>
      <div className="right-column">
        {props.loading ? (
          <Loader
            type="TailSpin"
            color="#00BFFF"
            height={42}
            width={42}
            // timeout={3000} //3 secs
          />
        ) : props.error ? (
          <ErrorIcon />
        ) : props.res ? (
          props.dataCheck ? (
            <AvailableIcon />
          ) : (
            <NotAvaliableIcon />
          )
        ) : (
          <ErrorIcon />
        )}
      </div>
    </div>
  );
};

DeliveryStatusItem.propTypes = {
  formSubmitted: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  res: PropTypes.object,
  dataCheck: PropTypes.bool,
};

export default DeliveryStatusItem;
