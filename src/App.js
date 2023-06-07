import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import Searchbar from "./Components/Searchbar";
import { AuthWrapper } from "./context/auth";


import MyNavigation from "./MyNavigation";
import { CartWrapper } from "./context/cart";

function App() {
  return (
    <BrowserRouter>
      <AuthWrapper>
        <CartWrapper>
        <ToastContainer />
        <Header />
        <Searchbar/>
        <MyNavigation />
        <Footer />
        </CartWrapper>
      </AuthWrapper>
    </BrowserRouter>
  );
}

export default App;