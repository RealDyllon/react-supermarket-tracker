import React, { useState } from "react";
import "./App.css";

// for spinner
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import DeliveryStatusItem from "./components/DeliveryStatusItem";

function App() {
  const localStoragePostCode = localStorage.getItem("postCode");
  console.log("localStoragePostCode", localStoragePostCode);

  const localStoragePostCodeRememberPref =
    localStorage.getItem("postCodeRememberPref") === "1";
  console.log(
    "localStoragePostCodeRememberPref",
    localStoragePostCodeRememberPref
  );

  // form live inputs
  const [postCodeInput, setPostCodeInput] = useState(
    localStoragePostCode ? localStoragePostCode : ""
  ); // live input
  const [isRememberPostCode, setRememberPostCode] = useState(
    localStoragePostCodeRememberPref
  );

  // form submission
  const [formSubmitted, setFormSubmitted] = useState(false);
  // const [requestedPostCode, setRequestedPostCode] = useState("");
  // const [requestedRememberPostCode, setRequestedRememberPostCode] = useState(
  //   false
  // );

  // ntuc
  const [isNtucLoading, setNtucLoading] = useState(false);
  const [ntucStoreRes, setNtucStoreRes] = useState(null); // eslint-disable-line no-unused-vars
  const [ntucStoreId, setNtucStoreId] = useState(null); // eslint-disable-line no-unused-vars
  const [ntucSlotRes, setNtucSlotRes] = useState(null);
  const [ntucSlotErr, setNtucSlotErr] = useState(null);

  // sheng shiong
  const [isShengShiongLoading, setShengShongLoading] = useState(false);
  const [shengShiongRes, setShengShiongRes] = useState(null);
  const [shengShiongErr, setShengShongErr] = useState(null);

  // cold storage
  const [isColdStorageLoading, setColdStorageLoading] = useState(false);
  const [coldStorageRes, setColdStorageRes] = useState(null);
  const [coldStorageErr, setColdStorageErr] = useState(null);

  // giant
  const [isGiantLoading, setGiantLoading] = useState(false);
  const [giantRes, setGiantRes] = useState(null);
  const [giantErr, setGiantErr] = useState(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // request time!
    console.log("postCode", postCodeInput);
    setFormSubmitted(true);

    setNtucLoading(true);
    setShengShongLoading(true);
    setColdStorageLoading(true);
    setGiantLoading(true);

    const postCode = postCodeInput;

    const rememberPostCodePref = isRememberPostCode;

    if (rememberPostCodePref) {
      localStorage.setItem("postCode", postCode);
      localStorage.setItem("postCodeRememberPref", 1); //true
    } else {
      localStorage.removeItem("postCode");
      localStorage.removeItem("postCodeRememberPref"); //true
    }

    reqNtuc(postCode);
    reqShengShiong(postCode);
    reqColdStorage(postCode);
    reqGiant(postCode);
  };

  const reqNtuc = (postCode) => {
    fetch(
      `https://website-api.omni.fairprice.com.sg/api/serviceable-area?city=Singapore&pincode=${postCode}`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("ntucStoreRes", result);
          setNtucStoreRes(result);

          const storeId = result && result.data && result.data.store.id;
          setNtucStoreId(storeId);

          console.log("ntuc storeId", storeId);

          fetch(
            `https://website-api.omni.fairprice.com.sg/api/slot-availability?address[pincode]=${postCode}&storeId=${storeId}`
          )
            .then((res) => res.json())
            .then(
              (result) => {
                setNtucLoading(false);
                setNtucSlotRes(result);
                console.log("ntucSlotRes", result);
              },
              (error) => {
                setNtucLoading(false);
                setNtucSlotRes(error);
                setNtucSlotErr(error);
                console.error("ntucSlotRes", error);
              }
            );
        },
        (error) => {
          setNtucStoreRes(error);
        }
      );
  };

  const reqShengShiong = (postCode) => {
    fetch(
      `https://n2ws6vu3e2.execute-api.ap-southeast-1.amazonaws.com/default/sheng-shiong-delivery?postcode=${postCode}`,
      {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("shengShiongRes", result);
          setShengShongLoading(false);
          setShengShiongRes(result);
        },
        (error) => {
          console.error("shengShiongRes", error);
          setShengShongLoading(false);
          setShengShongErr(error);
          setShengShiongRes(error);
        }
      );
  };

  const reqColdStorage = (postCode) => {
    fetch(
      `https://vsxhagxx79.execute-api.ap-southeast-1.amazonaws.com/default/cold-storage-delivery?postcode=${postCode}`,

      {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
        },
        // redirect: 'follow', // manual, *follow, error
        // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("coldStorageRes", result);
          setColdStorageLoading(false);
          setColdStorageRes(result);
        },

        (error) => {
          console.error("coldStorageRes", error);
          setColdStorageLoading(false);
          setColdStorageErr(error);
          setColdStorageRes(error);
        }
      );
  };

  const reqGiant = (postCode) => {
    fetch(
      `https://njkwnb0dok.execute-api.ap-southeast-1.amazonaws.com/default/giant-delivery?postcode=${postCode}`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("giantRes", result);
          setGiantLoading(false);
          setGiantRes(result);
        },

        (error) => {
          console.error("giantRes", error);
          setGiantLoading(false);
          setGiantErr(error);
          setGiantRes(error);
        }
      );
  };

  return (
    <div className="App">
      <div className="title-card">
        <h1 className="nunito-sans" style={{}}>
          Supermarket Tracker
        </h1>
        <h4 style={{ marginBottom: "8px" }}>Enter your post code:</h4>

        <form className="form" onSubmit={handleFormSubmit}>
          <label>
            <span>Post Code:</span>
            <input
              className="input-text"
              type="text"
              name="post code"
              value={postCodeInput}
              onChange={(e) => setPostCodeInput(e.target.value)}
            />
          </label>
          <input className="input-button" type="submit" value="Submit" />
          <label style={{ display: "block", marginTop: 8 }}>
            <input
              className="input-checkbox"
              type="checkbox"
              name="remember post code"
              checked={isRememberPostCode}
              onChange={() => setRememberPostCode(!isRememberPostCode)}
            />
            <span>Remember Post Code</span>
          </label>
        </form>
      </div>

      <div className="DeliveryStatusItems">
        <DeliveryStatusItem
          name="NTUC FairPrice"
          formSubmitted={formSubmitted}
          loading={isNtucLoading}
          res={ntucSlotRes}
          dataCheck={ntucSlotRes && ntucSlotRes.data.available}
          error={ntucSlotErr}
        />

        <DeliveryStatusItem
          name="Sheng Shiong"
          formSubmitted={formSubmitted}
          loading={isShengShiongLoading}
          res={shengShiongRes}
          dataCheck={
            shengShiongRes && shengShiongRes.result !== "No more timeslots."
          }
          error={shengShiongErr}
        />

        <DeliveryStatusItem
          name="Cold Storage"
          formSubmitted={formSubmitted}
          loading={isColdStorageLoading}
          res={coldStorageRes}
          dataCheck={coldStorageRes && coldStorageRes.earliest.available}
          error={coldStorageErr}
        />

        <DeliveryStatusItem
          name="Giant"
          formSubmitted={formSubmitted}
          loading={isGiantLoading}
          res={giantRes}
          dataCheck={giantRes && giantRes.earliest.available}
          error={giantErr}
        />
      </div>
    </div>
  );
}

export default App;
