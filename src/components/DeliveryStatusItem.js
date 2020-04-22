import React from "react";
import PropTypes from "prop-types";

const Item = (props) => {
  return (
    <div className="DeliveryStatusItem-Item">
      <h3>{props.name}</h3>
      <p>{props.avaliable ? "Slot Available =D" : "Slot Not Available :("}</p>
    </div>
  );
};

const DeliveryStatusItem = (props) => {
  return (
    <>
      {!props.error
        ? props.res &&
          (props.dataCheck ? (
            <Item name={props.name} available />
          ) : (
            <Item name={props.name} />
          ))
        : `API Error - ${props.error}`}
    </>
  );
};

DeliveryStatusItem.propTypes = {};

export default DeliveryStatusItem;
