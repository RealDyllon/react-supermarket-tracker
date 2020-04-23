import React, { useState } from "react";
import ReactGA from "react-ga";
import SnackbarProvider from "react-simple-snackbar";

//
import "./App.css";

// for spinner
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import DeliveryStatusItem from "./components/DeliveryStatusItem";
import DeliveryStatusItemStatic from "./components/DeliveryStatusItemStatic";
import TitleCard from "./components/TitleCard";

const delay = require("delay");

ReactGA.initialize("UA-159939917-3");
ReactGA.pageview(window.location.pathname + window.location.search);

function App() {
  const localStoragePostCode = localStorage.getItem("postCode");
  console.info("localStoragePostCode", localStoragePostCode);

  const localStoragePostCodeRememberPref =
    localStorage.getItem("postCodeRememberPref") === "1";
  console.info(
    "localStoragePostCodeRememberPref",
    localStoragePostCodeRememberPref
  );

  // global
  const [isItemCardsVisible, setItemCardsVisible] = useState(false);
  const [isPostCodeInvalid, setPostCodeInvalid] = useState(true);

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

    if (postCodeInput.length === 6) {
      setPostCodeInvalid(false);

      setItemCardsVisible(true);

      setNtucLoading(true);
      setShengShongLoading(true);
      setColdStorageLoading(true);
      setGiantLoading(true);

      delayFunction(); // setFormSubmitted(true);

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
    } else {
      console.log("POSTCODE INVALID!!!");
      setPostCodeInvalid(true);
    }
  };

  const delayFunction = async () => {
    await delay(100);

    // Executed 100 milliseconds later
    setFormSubmitted(true);
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
      <SnackbarProvider>
        <TitleCard
          handleFormSubmit={handleFormSubmit}
          postCodeInput={postCodeInput}
          setPostCodeInput={setPostCodeInput}
          isRememberPostCode={isRememberPostCode}
          setRememberPostCode={setRememberPostCode}
        />
      </SnackbarProvider>

      {isItemCardsVisible && (
        <div className="DeliveryStatusItems">
          <DeliveryStatusItem
            name="NTUC FairPrice"
            formSubmitted={formSubmitted}
            loading={isNtucLoading}
            res={ntucSlotRes}
            dataCheck={ntucSlotRes && ntucSlotRes.data.available}
            error={ntucSlotErr}
            shoppingCart="https://www.fairprice.com.sg/cart"
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
            shoppingCart="https://www.allforyou.sg/cart"
          />

          <DeliveryStatusItem
            name="Cold Storage"
            formSubmitted={formSubmitted}
            loading={isColdStorageLoading}
            res={coldStorageRes}
            dataCheck={coldStorageRes && coldStorageRes.earliest.available}
            error={coldStorageErr}
            shoppingCart="https://coldstorage.com.sg/checkout/cart"
          />

          <DeliveryStatusItem
            name="Giant"
            formSubmitted={formSubmitted}
            loading={isGiantLoading}
            res={giantRes}
            dataCheck={giantRes && giantRes.earliest.available}
            error={giantErr}
            shoppingCart="https://giant.sg/checkout/cart"
          />

          <DeliveryStatusItemStatic
            name="Redmart"
            site="redmart.com"
            href="https://redmart-delivery-schedule.lazada.sg"
            formSubmitted={formSubmitted}
          />
        </div>
      )}
    </div>
  );
}

export default App;
