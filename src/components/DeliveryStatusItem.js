import React from 'react'
import PropTypes from 'prop-types'

const DeliveryStatusItem = props => {
  return (
    <div>
      <h3>{props.name}</h3>
      {!props.isLoading &&
          (!props.error
            ? props.res &&
              (props.res.data.available
                ? "Slot Available =D"
                : "Slot Not Available :(")
            : `API Error - ${props.error}`)}
    </div>
  )
}

DeliveryStatusItem.propTypes = {

}

export default DeliveryStatusItem
