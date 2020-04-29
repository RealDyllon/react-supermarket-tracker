import React, { useReducer, useState } from "react";
import ReactGA from "react-ga";
import SnackbarProvider from "react-simple-snackbar";
import { FaHeart, FaPeopleCarry } from "react-icons/fa";

//
import "./App.css";

// for spinner
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import DATA from "./store/data";
import DeliveryStatusItem from "./components/DeliveryStatusItem";
import DeliveryStatusItemStatic from "./components/DeliveryStatusItemStatic";
import TitleCard from "./components/TitleCard";
import { IconContext } from "react-icons";

const delay = require("delay");

const redmart = {
  name: "Redmart",
  site: "redmart.com",
  url: "https://redmart-delivery-schedule.lazada.sg",
};

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);
ReactGA.pageview(window.location.pathname + window.location.search);

function App() {
  const localStoragePostCode = localStorage.getItem("postCode");
  // console.info("localStoragePostCode", localStoragePostCode);

  const localStoragePostCodeRememberPref =
    localStorage.getItem("postCodeRememberPref") === "1";
  // console.info(
  //   "localStoragePostCodeRememberPref",
  //   localStoragePostCodeRememberPref
  // );

  // global
  const [isItemCardsVisible, setItemCardsVisible] = useState(false);
  const [isPostCodeInvalid, setPostCodeInvalid] = useState(false);

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

  const reducer = (DATA, action) => {
    if (action.type == "LOAD_ALL") {
      return DATA.map((store) => {
        store.loading = true;
        return store;
      });
    }

    if (action.type == "LOADING") {
      return DATA.map((store) => {
        if (store.id == action.payload) {
          store.loading = false;
        }
        return store;
      });
    }

    if (action.type == "RESPONSE") {
      return DATA.map((store) => {
        if (store.id == action.payload.id) {
          store.response = action.payload.response;
        }
        return store;
      });
    }

    if (action.type == "ERROR") {
      return DATA.map((store) => {
        if (store.id == action.payload.id) {
          store.error = action.payload.response;
        }
        return store;
      });
    }

    if (action.type == "SET_UNSERVICEABLE") {
      return DATA.map((store) => {
        if (store.id == action.payload.id) {
          store.isUnserviceable = true;
        }
        return store;
      });
    }

    if (action.type == "IS_AVAILABLE") {
      return DATA.map((store) => {
        if (store.id == action.payload.id) {
          console.log("Store", store.id);
          console.log("Response", action.payload.response);

          store.dataCheck = true;
          store.error = false;
        }
        return store;
      });
    }
  };

  const [STORES, dispatch] = useReducer(reducer, DATA);

  function LOAD_ALL() {
    dispatch({ type: "LOAD_ALL" });
  }

  function LOADING(id) {
    dispatch({ type: "LOADING", payload: id });
  }

  function RESPONSE(id, response) {
    dispatch({ type: "RESPONSE", payload: { id, response } });
  }

  function ERROR(id, response) {
    dispatch({ type: "ERROR", payload: { id, response } });
  }

  function SET_UNSERVICEABLE(id) {
    dispatch({ type: "SET_UNSERVICEABLE", payload: id });
  }

  function IS_AVAILABLE(id, response) {
    dispatch({ type: "IS_AVAILABLE", payload: { id, response } });
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // request time!
    console.log("postCode", postCodeInput);

    if (postCodeInput.length === 6 && postCodeInput.substring(1) !== 0) {
      setPostCodeInvalid(false);

      setItemCardsVisible(true);

      LOAD_ALL();

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
    const id = "ntuc";
    fetch(
      `https://website-api.omni.fairprice.com.sg/api/serviceable-area?city=Singapore&pincode=${postCode}`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("ntucStoreRes", result);
          RESPONSE(id, result);

          const storeId = result && result.data && result.data.store.id;

          if (storeId) {
            console.log("ntuc storeId", storeId);

            fetch(
              `https://website-api.omni.fairprice.com.sg/api/slot-availability?address[pincode]=${postCode}&storeId=${storeId}`
            )
              .then((res) => res.json())
              .then(
                (result) => {
                  LOADING(id);
                  RESPONSE(id, result);
                  const available = result.data.available;
                  if (available) {
                    IS_AVAILABLE(id, result);
                  } else {
                    SET_UNSERVICEABLE(id);
                  }
                  console.log("ntucSlotRes", result);
                },
                (error) => {
                  LOADING(id);
                  RESPONSE(id, error);
                  ERROR(id, error);
                  console.error("ntucSlotRes", error);
                }
              );
          } else {
            SET_UNSERVICEABLE(id);
            LOADING(id);
            console.log("ntucSlotRes", "NTUC does not serve this area omg");
          }
        },
        (error) => {
          RESPONSE(id, error);
        }
      );
  };

  const reqShengShiong = (postCode) => {
    const id = "shengshiong";
    fetch(`${process.env.REACT_APP_SHENG_SHIONG_URL}?postcode=${postCode}`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("shengShiongRes", result);
          const response = result.response;
          LOADING(id);
          RESPONSE(id, result);
          if (response !== "Please try again.") {
            IS_AVAILABLE(id, true);
          } else {
            SET_UNSERVICEABLE(id);
          }
        },
        (error) => {
          console.error("shengShiongRes", error);
          LOADING(id);
          ERROR(id, error);
        }
      );
  };

  const reqColdStorage = (postCode) => {
    const id = "coldstorage";

    fetch(
      `${process.env.REACT_APP_COLD_STORAGE_URL}?postcode=${postCode}`,

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
          LOADING(id);
          RESPONSE(id, result);
          const earliest = result.earliest.available;
          if (earliest) {
            IS_AVAILABLE(id, earliest);
          } else {
            SET_UNSERVICEABLE(id);
          }
        },

        (error) => {
          console.error("coldStorageRes", error);
          LOADING(id);
          ERROR(id, error);
        }
      );
  };

  const reqGiant = (postCode) => {
    const id = "giant";
    fetch(`${process.env.REACT_APP_GIANT_URL}?postcode=${postCode}`)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("giantRes", result);
          LOADING(id);
          RESPONSE(id, result);
          const earliest = result.earliest.available;
          if (earliest) {
            IS_AVAILABLE(id, earliest);
          } else {
            SET_UNSERVICEABLE(id);
          }
        },

        (error) => {
          console.error("giantRes", error);
          LOADING(id);
          ERROR(id, error);
        }
      );
  };

  return (
    <div className="App">
      <div style={{ minHeight: "70vh" }}>
        <SnackbarProvider>
          <TitleCard
            handleFormSubmit={handleFormSubmit}
            postCodeInput={postCodeInput}
            setPostCodeInput={setPostCodeInput}
            isRememberPostCode={isRememberPostCode}
            setRememberPostCode={setRememberPostCode}
            isPostCodeInvalid={isPostCodeInvalid}
          />
        </SnackbarProvider>
        {isItemCardsVisible && (
          <div className="DeliveryStatusItems">
            {STORES.map((store, id) => (
              <DeliveryStatusItem
                key={id}
                name={store.name}
                formSubmitted={formSubmitted}
                loading={store.loading}
                res={store.response}
                dataCheck={store.dataCheck}
                error={store.error}
                isUnserviceable={store.isUnserviceable}
                shoppingCart={store.url}
              />
            ))}

            <DeliveryStatusItemStatic
              name={redmart.name}
              site={redmart.site}
              href={redmart.url}
              formSubmitted={formSubmitted}
            />
          </div>
        )}
      </div>

      <p style={{ marginBottom: 0 }}>
        Made with{" "}
        <IconContext.Provider
          value={{ color: "#fe2d55", size: 12, className: "global-class-name" }}
        >
          <FaHeart />
        </IconContext.Provider>{" "}
        by{" "}
        <a href="https://www.dyllon.dev" target="_blank" rel="noopener">
          Dyllon
        </a>
      </p>

      <p style={{ margin: "0 12px 10vh" }}>
        For enquiries, email me:{" "}
        <a
          style={{ textDecoration: "none" }}
          href="mailto:contact@dyllon.dev"
          target="_blank"
          rel="noopener"
        >
          contact@dyllon.dev
        </a>
      </p>
    </div>
  );
}

export default App;
