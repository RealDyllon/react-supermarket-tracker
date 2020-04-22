import React from "react";
import PropTypes from "prop-types";

import { FaCheck, FaTimes, FaExclamationTriangle } from "react-icons/fa";

import Loader from "react-loader-spinner";
import { IconContext } from "react-icons";

const NotAvaliableIcon = () => (
  <IconContext.Provider
    value={{ color: "#f08e38", size: 42, className: "react-icons-icon" }}
  >
    <div>
      <FaTimes />
    </div>
  </IconContext.Provider>
);

const AvailableIcon = () => (
  <IconContext.Provider
    value={{ color: "#63d880", size: 42, className: "react-icons-icon" }}
  >
    <div>
      <FaCheck />
    </div>
  </IconContext.Provider>
);

const ErrorIcon = () => (
  <IconContext.Provider
    value={{ color: "#e14337", size: 42, className: "react-icons-icon" }}
  >
    <div>
      <FaExclamationTriangle />
    </div>
  </IconContext.Provider>
);

const DeliveryStatusItem = (props) => {
  return (
    <>
      {props.formSubmitted && (
        <div className="DeliveryStatusItem-Item">
          <div className="left-column">
            <h3>{props.name}</h3>

            {props.loading ? (  
              <p>Checking timetables...</p>
            ) : props.error ? (
              props.error // return the error text
            ) : props.res ? (
              props.dataCheck ? (
                <p>Delivery Slot Avaliable</p>
              ) : (
                <p>Delivery Slot Not Available</p>
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
                height={32}
                width={32}
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
      )}
    </>
  );
};

DeliveryStatusItem.propTypes = {};

export default DeliveryStatusItem;
