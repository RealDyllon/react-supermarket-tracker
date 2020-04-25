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

const stores = {
  ntuc: {
    name: "NTUC FairPrice",
    url: "https://www.fairprice.com.sg/cart",
  },
  shengShiong: {
    name: "Sheng Shiong",
    url: "https://www.allforyou.sg/cart",
  },
  coldStorage: {
    name: "Cold Storage",
    url: "https://coldstorage.com.sg/checkout/cart",
  },
  giant: {
    name: "Giant",
    url: "https://giant.sg/checkout/cart",
  },
  redmart: {
    name: "Redmart",
    site: "redmart.com",
    url: "https://redmart-delivery-schedule.lazada.sg",
  },
};

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);
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

  // ntuc
  const [isNtucLoading, setNtucLoading] = useState(false);
  const [ntucStoreRes, setNtucStoreRes] = useState(null); // eslint-disable-line no-unused-vars
  const [ntucStoreId, setNtucStoreId] = useState(null); // eslint-disable-line no-unused-vars
  const [ntucSlotRes, setNtucSlotRes] = useState(null);
  const [ntucSlotErr, setNtucSlotErr] = useState(null);
  const [isNtucUnserviceable, setNtucUnserviceable] = useState(false);

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
        if (store.id == action.payload.name) {
          store.response = action.payload.response;
        }
        return store;
      });
    }

    if (action.type == "ERROR") {
      return DATA.map((store) => {
        if (store.id == action.payload.name) {
          store.error = action.payload.response;
        }
        return store;
      });
    }

    if (action.type == "SERVICEABLE") {
      return DATA.map((store) => {
        if (store.id == action.payload.name) {
          store.isserviceable = true;
        }
        return store;
      });
    }
  };

  const [STORES, dispatch] = useReducer(reducer, DATA);

  function LOAD_ALL() {
    dispatch({ type: "LOAD_ALL" });
  }

  function LOADING(name) {
    dispatch({ type: "LOADING", payload: name });
  }

  function RESPONSE(name, response) {
    dispatch({ type: "RESPONSE", payload: { name, response } });
  }

  function ERROR(name, response) {
    dispatch({ type: "ERROR", payload: { name, response } });
  }

  function SERVICEABLE(name, response) {
    dispatch({ type: "SERVICEABLE", payload: { name, response } });
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
    fetch(
      `https://website-api.omni.fairprice.com.sg/api/serviceable-area?city=Singapore&pincode=${postCode}`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          const id = "ntuc";
          console.log("ntucStoreRes", result);
          RESPONSE(id, result);

          // setNtucStoreRes(result);

          const storeId = result && result.data && result.data.store.id;
          // setNtucStoreId(storeId);

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
            SERVICEABLE(id, false);
            LOADING(id);
            console.log("ntucSlotRes", "NTUC does not serve this area omg");
          }
        },
        (error) => {
          const id = "ntuc";

          // setNtucStoreRes(error);
          RESPONSE(id, error);
        }
      );
  };

  const reqShengShiong = (postCode) => {
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
          const id = "shengshiong";

          console.log("shengShiongRes", result);
          LOADING(id);
          RESPONSE(id, result);
          // setShengShongLoading(false);
          // setShengShiongRes(result);
        },
        (error) => {
          const id = "shengshiong";

          console.error("shengShiongRes", error);
          LOADING(id);
          ERROR(id, error);
          // setShengShongLoading(false);
          // setShengShongErr(error);
          // setShengShiongRes(error);
        }
      );
  };

  const reqColdStorage = (postCode) => {
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
          const id = "coldstorage";

          console.log("coldStorageRes", result);
          // setColdStorageLoading(false);
          // setColdStorageRes(result);

          LOADING(id);
          RESPONSE(id, result);
        },

        (error) => {
          const id = "coldstorage";

          console.error("coldStorageRes", error);
          // setColdStorageLoading(false);
          // setColdStorageErr(error);

          LOADING(id);
          ERROR(id, error);
          // setColdStorageRes(error);
        }
      );
  };

  const reqGiant = (postCode) => {
    fetch(`${process.env.REACT_APP_GIANT_URL}?postcode=${postCode}`)
      .then((res) => res.json())
      .then(
        (result) => {
          const id = "coldstorage";

          console.log("giantRes", result);
          // setGiantLoading(false);
          // setGiantRes(result);

          LOADING(id);
          RESPONSE(id, result);
        },

        (error) => {
          const id = "coldstorage";
          console.error("giantRes", error);
          // setGiantLoading(false);
          // setGiantErr(error);
          LOADING(id);
          ERROR(id, error);
          // setGiantRes(error);
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
        {/* <div>
          {state.map((store, idx) => (
            <div key={idx}>
              <div>{store.name + idx}</div>
              <div>
                <button onClick={() => LOAD_ALL(store.name)}>loading</button>
              </div>
            </div>
          ))}
        </div> */}

        {isItemCardsVisible && (
          <div className="DeliveryStatusItems">
            {STORES.map((store, idx) => (
              <DeliveryStatusItem
                name={store.name}
                formSubmitted={formSubmitted}
                loading={store.loading}
                res={store.response}
                dataCheck={store.dataCheck}
                error={store.error}
                isUnserviceable={store.serviceable}
                shoppingCart={store.url}
              />
            ))}

            <DeliveryStatusItemStatic
              name={stores.redmart.name}
              site={stores.redmart.site}
              href={stores.redmart.url}
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
