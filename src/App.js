import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import axios from "axios";

import "./App.css";
import Register from "./components/Register/Register";
import Banner from "./components/Banner/Banner";
import Category from "./components/Category/Category";
import CategoryList from "./components/Category/CategoryList";
import ProductDetail from "./components/ProductDetail/ProductDetail";

function App() {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [beerDetailOpen, setBeerDetailOpen] = useState(false);
  const [state, setState] = useState({
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    passwordConfirmation: null,
    currentUser: null,
    beers: [],
    currentBeer: {},
  });

  const filterBeerCategories = () => {
    const categories = [];

    state.beers.forEach((beer) => {
      if (!categories.includes(beer.type)) {
        categories.push(beer.type);
      }
    });
    console.log("categories function: ", categories);
    return categories;
  };

  const beersByCategory = (category) => {
    const beerListCategory = state.beers.filter(
      (beer) => beer.type === category
    );
    return beerListCategory;
  };
  const handleLoginOpen = (e) => {
    console.log("Open Login modal");
    setLoginOpen(true);
  };

  const handleLoginChange = (e) => {
    e.persist();
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.trim(),
    }));
  };

  const handleLoginClose = (e) => {
    setLoginOpen(false);
    setState((prev) => ({
      ...prev,
      email: null,
      password: null,
    }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Here");

    return axios
      .post("/api/login", {
        email: state.email,
        password: state.password,
      })
      .then((data) => {
        console.log("login promise data:  ", data);
        setState((prev) => ({
          ...prev,
          currentUser: data.data.user,
        }));

        handleLoginClose();
      })
      .catch((err) => {
        console.log("Login Error: ", err);
      });
  };

  const handleRegisterOpen = (e) => {
    console.log("Open Register modal");
    // Uncomment this when the modal is here:
    setRegisterOpen(true);
  };

  const handleRegisterChange = (e) => {
    e.persist();
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.trim(),
    }));
  };

  const handleRegisterClose = (e) => {
    setRegisterOpen(false);
    setState((prev) => ({
      ...prev,
      firstName: null,
      lastName: null,
      email: null,
      password: null,
    }));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email,
      password: state.password,
    };

    if (state.password !== state.passwordConfirmation) {
      console.log("Passwords do not match");
      return;
    }

    return axios
      .post("/api/register", newUser)
      .then((data) => {
        console.log("Register promise data: ", data);
        setState((prev) => ({
          ...prev,
          currentUser: data.data.user,
        }));
        handleRegisterClose();
      })
      .catch((err) => {
        console.log("Register Error: ", err);
      });
  };

  const handleLogout = (e) => {
    e.preventDefault();

    console.log("Logout clicked");
    return axios.post("/api/logout").then((data) => {
      setState((prev) => ({
        ...prev,
        currentUser: null,
      }));
    });
  };

  const handleBeerDetailClick = (id) => {
    setBeerDetailOpen(true);

    setState((prev) => ({
      ...prev,
      currentBeer: state.beers[id - 1],
    }));
  };

  const handleBeerDetailClose = (e) => {
    setBeerDetailOpen(false);

    // setState((prev) => ({
    //   ...prev,
    //   currentBeer: undefined,
    // }));
  };

  // Get all the beers once the home page is loaded
  useEffect(() => {
    Promise.resolve(axios.get("/api/beers"))
      .then((res) => {
        console.log("beers api :", res.data.data);
        setState((prev) => ({
          ...prev,
          beers: [...res.data.data],
        }));
      })
      .catch((err) => {
        console.log("Error getting beers: ", err);
      });
  }, []);

  useEffect(() => {
    Promise.resolve(axios.get("/api/user"))
      .then((res) => {
        console.log("user api :", res);
        setState((prev) => ({
          ...prev,
          currentUser: res.data.data,
        }));
      })
      .catch((err) => {
        console.log("Error getting beers: ", err);
      });
  }, []);

  return (
    <div className="App">
      <Navbar
        handleRegisterOpen={handleRegisterOpen}
        handleLoginOpen={handleLoginOpen}
        currentUser={state.currentUser}
        handleLogout={handleLogout}
      />
      <Login
        open={loginOpen}
        onChange={handleLoginChange}
        handleClose={handleLoginClose}
        onSubmit={handleLoginSubmit}
      />
      <Register
        open={registerOpen}
        onChange={handleRegisterChange}
        handleClose={handleRegisterClose}
        onSubmit={handleRegisterSubmit}
      />
      <Banner />
      {state.beers.length > 0 &&
        filterBeerCategories().map((type) => {
          return (
            <Category
              category={type}
              beers={beersByCategory(type)}
              onClick={handleBeerDetailClick}
            />
          );
        })}

      <ProductDetail
        open={beerDetailOpen}
        handleClose={handleBeerDetailClose}
        currentBeer={state.currentBeer}
      />
    </div>
  );
}

export default App;
