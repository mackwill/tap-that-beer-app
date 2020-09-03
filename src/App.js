import React, { useState, useEffect, Fragment } from "react";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import axios from "axios";

import "./App.css";
import Register from "./components/Register/Register";
import Banner from "./components/Banner/Banner";
import Category from "./components/Category/Category";
import BeerCategoryList from "./components/Category/BeerCategoryList";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import Search from "./components/Search/Search";
import Review from "./components/ReviewForm/Review";
import Account from "./components/Account/Account";
import Wishlist from "./components/Wishlist/Wishlist";
import MyWishlist from "./components/MyReviews/MyReviews";
import MyReviews from "./components/MyReviews/MyReviews";
import ShareOption from "./components/ShareOption/ShareOption";
import Button from "@material-ui/core/Button";
import Snackbar from "./components/Small-Components/Snackbar";
import MyAccount from "./components/Account/MyAccount";
import CustomAlert from "./components/Alert/CustomAlert";
import Scanner from "./components/Scanner/Scanner";
import EditReview from "./components/MyReviews/EditReview";
//import Review from './components/Review/Review'

function App() {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [beerDetailOpen, setBeerDetailOpen] = useState(false);
  const [accuontOpen, setAccuontOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [reviewOpen, setReviewOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [myWishlistOpen, setMyWishlistOpen] = useState(false);
  const [myReviewsOpen, setMyReviewsOpen] = useState(false);
  const [userNote, setUserNote] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [editMyReviewsOpen, setEditMyReviewsOpen] = useState(false);
  const [singleReview, setSingleReview] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [currentBeer, setCurrentBeer] = useState(null);
  const [beers, setBeers] = useState([]);
  const [top10RatedBeers, setTop10RatedBeers] = useState([]);
  const [top10ReviewedBeers, setTop10ReviewedBeers] = useState([]);
  const [beerCategories, setBeerCategories] = useState([]);
  const [currentBeerReviews, setCurrentBeerReviews] = useState([]);
  const [recommendedBeers, setRecommendedBeers] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [currentWishlist, setCurrentWishlist] = useState([]);

  const [state, setState] = useState({
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    passwordConfirmation: null,
  });
  const [openSB, setOpenSB] = useState(false);
  const [textSB, setTextSB] = useState(false);

  const handleClickSB = (text) => {
    setOpenSB(true);
    setTextSB(text);
  };

  const handleCloseSB = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSB(false);
  };
  const filterBeerCategories = () => {
    const categories = [];

    beers.forEach((beer) => {
      if (!categories.includes(beer.type)) {
        categories.push(beer.type);
      }
    });
    return categories;
  };

  const beersByCategory = (category) => {
    const beerListCategory = beers.filter((beer) => beer.type === category);
    return beerListCategory;
  };

  const handleSearchOpen = (e) => {
    setSearchOpen(true);
  };
  const handleSearchClose = (e) => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  const handleShareOptionOpen = (e) => {
    setShareOpen(true);
  };

  const handleShareOptionClose = (e) => {
    setShareOpen(false);
  };

  const handleEditReviewOpen =  async (id) => {
    console.log(id);
    const selectedEditReviewId = state.currentBeerReviews.filter((beer) => {
      return id === beer.id;
    });
    console.log('this is selectedEdit', selectedEditReviewId);
    await setSingleReview(selectedEditReviewId[0])
    console.log('single review after await', singleReview, selectedEditReviewId); 
    setEditMyReviewsOpen(true);

  };

  const handleEditReviewClose = (e) => {
    setEditMyReviewsOpen(false);
  };

  const handleReviewOpen = (e) => {
    setReviewOpen(true);
  };

  const handleReviewClose = (e) => {
    setReviewOpen(false);
  };

// Delete a review from your list of My Reviews
// const handleEditMyReview = (review_id) => {
//   if (!state.currentUser) {
//     setLoginOpen(true);
//     return;
//   }
  
//     return axios
//       .get(`/api/reviews/${review_id}`)
//       .then((res) => {
//         setState((prev) => ({
//           ...prev,
//           currentBeerReviews: newBeerReview,
//         }));
        
//       });
// }



  // Removes the deleted beer from =the state list of currentBeer Reviews
  const removeDeletedBeerReview = (id) => {
    const filteredList = state.currentBeerReviews.filter((beer) => {
      return id !== beer.id;
    });
    return filteredList;
  };

  // Check if user has already reviewed that beer
  const hasUserReviewedBeer = (id) => {
    const filteredList = state.currentBeerReviews.filter((beer) => {
      return id === beer.id;
    });
    return filteredList;
  };

  // Delete a review from your list of My Reviews
  const handleDeleteMyReview = (review_id) => {
    if (!state.currentUser) {
      setLoginOpen(true);
      return;
    }

    
      return axios
        .delete(`/api/reviews/${review_id}`)
        .then((res) => {
          const newBeerReview = removeDeletedBeerReview(review_id);
          setState((prev) => ({
            ...prev,
            currentBeerReviews: newBeerReview,
          }));
          handleClickSB(
            `Your review was removed from your Review list`
          );
        });
  }

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
    setErrMessage(null);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Here");

    if (!state.email || !state.password) {
      setErrMessage("Please fill out both fields to login");
      return;
    }
    return axios
      .post("/api/login", {
        email: state.email,
        password: state.password,
      })
      .then((res) => {
        console.log("login promise res:  ", res);

        setCurrentUser(res.data.user);
        handleLoginClose();
      })
      .catch((err) => {
        setErrMessage("Invalid email or password");
      });
  };

  const handleRegisterOpen = (e) => {
    console.log("Open Register modal");
    // Uncomment this when the modal is here:
    setRegisterOpen(true);
  };

  const handleRegisterChange = (e) => {
    e.persist();
    console.log("e.target.value", e.target.value);
    console.log("e.target.name", e.target.name);
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
    setErrMessage(null);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    if (
      !state.firstName ||
      !state.lastName ||
      !state.email ||
      !state.password ||
      !state.passwordConfirmation
    ) {
      setErrMessage("Please fill out all fields");
      return;
    } else if (state.password !== state.passwordConfirmation) {
      setErrMessage("Passwords do not match");
      return;
    }

    const newUser = {
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email,
      password: state.password,
    };
    return axios
      .post("/api/register", newUser)
      .then((res) => {
        console.log("Register promise data: ", res);
        setCurrentUser(res.data.user);
        handleRegisterClose();
      })
      .catch((err) => {
        setErrMessage("That email already exists");
      });
  };

  const handleLogout = (e) => {
    e.preventDefault();

    console.log("Logout clicked");
    return axios.post("/api/logout").then((data) => {
      setCurrentUser(null);
      setCurrentWishlist([]);

      handleClickSB(`You are now logged out`);
    });
  };

  const handleClickFromSearchResult = (id) => {
    handleBeerDetailClick(id);

    const body = {
      beer_id: id,
      query: searchQuery,
      user_id: currentUser && currentUser.id,
    };
    return axios
      .post("/api/search/analytics", body)
      .then((data) => console.log("added search analytics:", data))
      .catch((e) => console.log("Search analytics failed", e));
  };

  const isBeerInRecentlyViewedList = (id) => {
    const filteredList = recentlyViewed.filter((beer) => beer.id === id);
    return filteredList;
  };

  const handleBeerDetailClick = async (id) => {
    setBeerDetailOpen(true);
    let userId = null;
    if (currentUser) {
      userId = currentUser.id;
    }

    if (isBeerInRecentlyViewedList(id).length === 0) {
      console.log("thijierotiejotjeroitjeorijt");
      await axios.post("/api/search/analytics", {
        user_id: userId,
        beer_id: id,
      });
    }
    const selectedBeer = await axios.get(`/api/beers/${id}`);
    const reviewsOfSelectedBeer = await axios.get(`/api/reviews/beers/${id}`);
    setCurrentBeer(selectedBeer.data.beer);
    setCurrentBeerReviews(reviewsOfSelectedBeer.data);
  };

  const handleBeerDetailClose = (e) => {
    setBeerDetailOpen(false);

    setTimeout(() => {
      setCurrentBeer(null);
      setCurrentBeerReviews([]);
    }, 300);
  };

  const handleAccountOpen = (e) => {
    // Uncomment when modal is here
    const prevFirstName = currentUser.first_name;
    const prevLastName = currentUser.last_name;
    const prevEmail = currentUser.email;
    setState((prev) => ({
      ...prev,
      firstName: prevFirstName,
      lastName: prevLastName,
      email: prevEmail,
    }));
    setAccuontOpen(true);
    return axios.get("/api/reviews/user").then((res) => {
      setCurrentBeerReviews(res.data.data);
    });
  };

  // Handle account detail change form submit
  const handleAccountChangeSubmit = (e) => {
    e.preventDefault();
    const newAccountDetails = {
      first_name: state.firstName,
      last_name: state.lastName,
      email: state.email,
      password: currentUser.password,
    };

    return axios
      .put("/api/user", newAccountDetails)
      .then((res) => {
        setCurrentUser(res.data.data);
      })
      .catch((err) => console.log("Error Updating Account: ", err));
  };
  // Get list of beers wishlisted by the currently logged in user
  const handleMyWishlistOpen = (e) => {
    setMyWishlistOpen(true);

    return axios
      .get("/api/wishlists")
      .then((res) => {
        setCurrentWishlist(res.data.data);
      })
      .catch((err) => console.log("Error: ", err));
  };

  // Check if user has already wishlisted that beer
  const hasUserWishlistedBeer = (id) => {
    const filteredList = currentWishlist.filter((beer) => {
      return id === beer.id;
    });
    return filteredList;
  };

  // Removes the deleted beer from the state list of currentWishlist
  const removeDeletedBeer = (id) => {
    const filteredList = currentWishlist.filter((beer) => {
      return id !== beer.id;
    });
    return filteredList;
  };

  // Add an item to your wishlist if it isn't already liked
  const handleAddToWishlist = (e) => {
    if (!currentUser) {
      setLoginOpen(true);
      return;
    }

    // Check to see if the user has already wishlisted a beer
    // and remove it from the wishlist if they have
    if (hasUserWishlistedBeer(currentBeer.id).length > 0) {
      const wish = currentWishlist.filter(
        (elm) => elm.id === currentBeer.id
      )[0];
      return axios.delete(`/api/wishlists/${wish.w_id}`).then((res) => {
        const newWishList = removeDeletedBeer(currentBeer.id);

        setCurrentWishlist(newWishList);
        handleClickSB(`${currentBeer.name} was removed from your wishlist`);
      });
    }

    if (currentUser && currentBeer) {
      return axios
        .post("/api/wishlists", {
          beer_id: currentBeer.id,
          user_id: currentUser.id,
        })
        .then((res) => {
          const newWishList = [...currentWishlist, currentBeer];
          setCurrentWishlist([...newWishList]);
          handleClickSB(`${currentBeer.name} was saved to wishlist`);
        })
        .catch((err) => console.log("err, ", err));
    }
  };

  const handleMyReviewsOpen = (e) => {
    setMyReviewsOpen(true);
    return axios.get("/reviews/user").then((res) => {
      setState((prev) => ({
        ...prev,
        currentBeerReviews: [...res.data.data],
      }));
    });
  };

  const handleMyReviewsClose = (e) => {
    setMyReviewsOpen(false);
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        currentBeerReviews: [],
      }));
    }, 500);
  };
  // Sort beers by highest rated
  const sortTopBeers = () => {
    const copyBeers = [...beers];

    copyBeers.sort((a, b) => {
      return Number(a.avg_rank) - Number(b.avg_rank);
    });
    return copyBeers.reverse();
  };

  // Sort beers by most reviewed
  const sortReviewedBeers = () => {
    const copyBeers = [...beers];
    copyBeers.sort((a, b) => {
      return a.num_reviews - b.num_reviews;
    });
    return copyBeers.reverse();
  };

  // Open scanner
  const handleScannerOpen = (e) => {
    setScannerOpen(true);
  };

  const handleScannerClose = (e) => {
    setScannerOpen(false);
  };

  const handleCategoryClick = (category) => {
    setSearchOpen(true);
    setSearchQuery(category);
  };

  // Get all the beers once the home page is loaded
  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("/api/beers/top10rated")),
      Promise.resolve(axios.get("/api/beers/top10reviewed")),
      Promise.resolve(axios.get("/api/beers/categories")),
    ])
      .then((all) => {
        console.log("all:  ", all);
        setTop10RatedBeers(all[0].data.data);
        setTop10ReviewedBeers(all[1].data.data);
        setBeerCategories(all[2].data.data);
      })
      .catch((err) => {
        console.log("Error getting beers: ", err);
      });
  }, []);

  useEffect(() => {
    Promise.resolve(axios.get("/api/user")).then((res) => {
      console.log("res of current user");
      setCurrentUser(res.data.data);
    });
  }, []);

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("/api/wishlists")),
      Promise.resolve(axios.get("/api/beers/recommendations")),
      Promise.resolve(axios.get("/api/beers/recently")),
    ])
      .then((all) => {
        setCurrentWishlist(all[0].data.data);
        setRecommendedBeers(all[1].data.data);
        setRecentlyViewed(all[2].data.data);
      })
      .then((res) => {
        return axios.get("/api/beers/recommendations");
      })
      .then((res) => {
        console.log("res recommendation: ", res);
        // setState((prev) => ({
        //   ...prev,
        //   recommendedBeers: [...res.data.data],
        // }));
      })
      .catch((err) => {
        console.log("Error getting beers: ", err);
      });
  }, [currentUser]);

  return (
    <div className="App">
      <Navbar
        handleSearchOpen={handleSearchOpen}
        handleRegisterOpen={handleRegisterOpen}
        handleLoginOpen={handleLoginOpen}
        currentUser={currentUser}
        handleLogout={handleLogout}
        handleAccountOpen={handleAccountOpen}
        handleScannerOpen={handleScannerOpen}
      />
      <Login
        open={loginOpen}
        onChange={handleLoginChange}
        handleClose={handleLoginClose}
        onSubmit={handleLoginSubmit}
        errMessage={errMessage}
      />
      <Register
        open={registerOpen}
        onChange={handleRegisterChange}
        handleClose={handleRegisterClose}
        onSubmit={handleRegisterSubmit}
        errMessage={errMessage}
      />

      <Banner />

      {currentUser && (
        <Fragment>
          {recommendedBeers.length != 0 && (
            <Category
              category={"Recommended"}
              beers={recommendedBeers}
              onClick={handleBeerDetailClick}
            />
          )}
          {recentlyViewed.length != 0 && (
            <Category
              category={"Recently Viewed"}
              beers={recentlyViewed}
              onClick={handleBeerDetailClick}
            />
          )}
        </Fragment>
      )}

      {top10RatedBeers.length > 0 && (
        <Category
          category={"Top 10 Rated Beers"}
          beers={top10RatedBeers}
          onClick={handleBeerDetailClick}
        />
      )}
      {top10ReviewedBeers.length > 0 && (
        <Category
          category={"Top 10 Reviewed Beers"}
          beers={top10ReviewedBeers}
          onClick={handleBeerDetailClick}
        />
      )}

      {beerCategories.length > 0 && (
        <BeerCategoryList
          title={"Categories"}
          categories={beerCategories}
          handleCategoryClick={handleCategoryClick}
        />
      )}

      {currentBeer && (
        <ProductDetail
          open={beerDetailOpen}
          handleClose={handleBeerDetailClose}
          currentBeer={currentBeer}
          beers={beers}
          reviews={currentBeerReviews}
          openForm={handleReviewOpen}
          currentUser={currentUser}
          handleAddToWishlist={handleAddToWishlist}
          handleShareOptionOpen={handleShareOptionOpen}
          userNote={userNote}
          setOpenSB={handleClickSB}
          onClick={handleBeerDetailClick}
          setUserNote={setUserNote}
        />
      )}
      <Search
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        open={searchOpen}
        close={handleSearchClose}
        onClick={handleClickFromSearchResult}
      />
      <Review
        currentBeer={currentBeer}
        open={reviewOpen}
        close={handleReviewClose}
      />
      <ShareOption open={shareOpen} close={handleShareOptionClose} />

      <Wishlist
        open={myWishlistOpen}
        close={() => setMyWishlistOpen(false)}
        beers={currentWishlist}
        onClick={handleBeerDetailClick}
      />
      <MyReviews
        open={myReviewsOpen}
        close={() => setMyReviewsOpen(false)}
        reviews={state.currentBeerReviews}
      />
      {Object.keys(singleReview).length && <EditReview
        open={editMyReviewsOpen}
        close={handleEditReviewClose}
        review={singleReview}
      />}




      <Button onClick={() => handleClickSB()}>Open simple snackbar</Button>
      <Snackbar handleClose={handleCloseSB} open={openSB} textSB={textSB} />
      {state.firstName && currentUser && (
        <MyAccount
          firstNameBeforeUpdate={currentUser.first_name}
          lastNameBeforeUpdate={currentUser.last_name}
          first_name={state.firstName}
          last_name={state.lastName}
          email={state.email}
          open={accuontOpen}
          handleClose={() => setAccuontOpen(false)}
          handleAccountChange={handleRegisterChange}
          beers={currentWishlist}
          reviews={currentBeerReviews}
          handleDeleteMyReview={handleDeleteMyReview}
          //handleEditMyReview={handleEditMyReview}
          handleEditReviewOpen={handleEditReviewOpen}
          onSubmit={handleAccountChangeSubmit}
        />
      )}
      <Scanner
        open={scannerOpen}
        handleClose={handleScannerClose}
        openBeer={handleBeerDetailClick}
        beers={beers}
      />
    </div>
  );
}

export default App;
