import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthContext } from "./context/auth";
import CartPg from "./Pages/CartPg";
import HomePg from "./Pages/HomePg";
import LoginPg from "./Pages/LoginPg";
import UpdateProfile from "./Pages/UpdateProfile";
import RegPg from "./Pages/RegPg";
import Book from "./Pages/Book";
import AddBook from "./Pages/AddBook";
import Users from "./Pages/Users";
import Categories from "./Pages/Categories";
import AddCategory from "./Pages/AddCategory";
import EditUser from "./Pages/EditUser";

function MyNavigation() {
  const authContext = useAuthContext();

  const Redirect = <Navigate to={"/login"} />;
  return (
    <Routes>
      <Route path="/" element={authContext.user.id ? <HomePg /> : Redirect} />
      <Route path="/login" element={<LoginPg />} />
      <Route
        path="/register"
        element={!authContext.user.id ? <RegPg /> : Redirect}
      />
      <Route
        path="/update-profile"
        element={authContext.user.id ? <UpdateProfile /> : Redirect}
      />
      <Route path="/book" element={authContext.user.id ? <Book /> : Redirect} />
      <Route
        path="/add-book"
        element={authContext.user.id ? <AddBook /> : Redirect}
      />
      <Route path="/users" element={authContext.user.id ? <Users /> : Redirect} />
      <Route
        path="/edit-user"
        element={authContext.user.id ? <EditUser /> : Redirect}
      />
       <Route
        path="/edit-user/:id"
        element={authContext.user.id ? <EditUser /> : Redirect}
      />
      <Route
        path="/categories"
        element={authContext.user.id ? <Categories /> : Redirect}
      />
      <Route
        path="/add-category"
        element={authContext.user.id ? <AddCategory /> : Redirect}
      />
      <Route
        path="/add-category/:id"
        element={authContext.user.id ? <AddCategory /> : Redirect}
      />
      <Route
        path="/add-book/:id"
        element={authContext.user.id ? <AddBook /> : Redirect}
      />
      <Route
        path="/cart-page"
        element={authContext.user.id ? <CartPg /> : Redirect}
      />
    </Routes>
  );
}

export default MyNavigation;
