import React, { useEffect, useState } from "react";
import { cartStyle } from "./CartStyle";
import { Typography, Button, Link } from "@mui/material";
import cartService from "../service/cart.service";
import { useAuthContext } from "../context/auth";
import { toast } from "react-toastify";
import orderService from "../service/order.service";
import { useCartContext } from "../context/cart";
import { useNavigate } from "react-router-dom";
import shared from "../utils/shared";

const CartPg = () => {
  const authContext = useAuthContext();
  const cartContext = useCartContext();
  const navigate = useNavigate();

  const [cartList, setCartList] = useState([]);
  const [itemsInCart, setItemsInCart] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const classes = cartStyle();

  const getTotalPrice = (itemList) => {
    let totalPrice = 0;
    itemList.forEach((item) => {
      const itemPrice = item.quantity * parseInt(item.book.price);
      totalPrice = totalPrice + itemPrice;
    });
    setTotalPrice(totalPrice);
  };

  useEffect(() => {
    setCartList(cartContext.cartData);
    setItemsInCart(cartContext.cartData.length);
    getTotalPrice(cartContext.cartData);
  }, [cartContext.cartData]);

  const removeItem = async (id) => {
    try {
      const res = await cartService.removeItem(id);
      if (res) {
        cartContext.updateCart();
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const updateQuantity = async (cartItem, inc) => {
    const currentCount = cartItem.quantity;
    const quantity = inc ? currentCount + 1 : currentCount - 1;
    if (quantity === 0) {
      toast.error("Item quantity should not be zero");
      return;
    }

    try {
      const res = await cartService.updateItem({
        id: cartItem.id,
        userId: cartItem.userId,
        bookId: cartItem.book.id,
        quantity,
      });
      if (res) {
        const updatedCartList = cartList.map((item) =>
          item.id === cartItem.id ? { ...item, quantity } : item
        );
        cartContext.updateCart(updatedCartList);
        const updatedPrice =
          totalPrice +
          (inc
            ? parseInt(cartItem.book.price)
            : -parseInt(cartItem.book.price));
        setTotalPrice(updatedPrice);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const placeOrder = async () => {
    if (authContext.user.id) {
      const userCart = await cartService.getList(authContext.user.id);
      if (userCart.length) {
        try {
          let cartIds = userCart.map((element) => element.id);
          const newOrder = {
            userId: authContext.user.id,
            cartIds,
          };
          const res = await orderService.placeOrder(newOrder);
          if (res) {
            cartContext.updateCart();
            navigate("/");
            toast.success(shared.messages.ORDER_SUCCESS);
          }
        } catch (error) {
          toast.error(`Order cannot be placed ${error}`);
        }
      } else {
        toast.error("Your cart is empty");
      }
    }
  };

  return (
    <div className={classes.cartWrapper}>
      <div className="container">
      <Typography
        variant="h4"
        sx={{
          marginTop: "25px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          color: "#474747",
        }}
      >
        Cart Page
      </Typography>
      <center>
          <hr
            style={{
              background: "red",
              color: "red",
              borderColor: "red",
              height: "4px",
              marginInline: "30px",
              width: "200px",
            }}
          />
        </center>
        <br></br>
        <br></br>
        <div className="cart-heading-block">
          <Typography variant="h2">
            My Shopping Bag ({itemsInCart} Items)
          </Typography>
          <div className="total-price">Total price: {totalPrice}</div>
        </div>
        <div className="cart-list-wrapper">
          {cartList.map((cartItem) => {
            return (
              <div className="cart-list-item" key={cartItem.id}>
                <div className="cart-item-img">
                  <Link>
                    <img src={cartItem.book.base64image} alt="dummy-pic" />
                  </Link>
                </div>
                <div className="cart-item-content">
                  <div className="cart-item-top-content">
                    <div className="cart-item-left">
                      <p className="brand">{cartItem.book.name}</p>
                      <Link>Cart item name</Link>
                    </div>
                    <div className="price-block">
                      <span className="current-price">
                        MRP &#8377; {cartItem.book.price}
                      </span>
                    </div>
                  </div>
                  <div className="cart-item-bottom-content">
                    <div className="qty-group">
                      <Button
                        className="btn pink-btn"
                        onClick={() => updateQuantity(cartItem, true)}
                      >
                        +
                      </Button>
                      <span className="number-count">{cartItem.quantity}</span>
                      <Button
                        className="btn pink-btn"
                        onClick={() => updateQuantity(cartItem, false)}
                      >
                        -
                      </Button>
                    </div>
                    <Link onClick={() => removeItem(cartItem.id)}>Remove</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="btn-wrapper">
          <Button
                  variant="contained"
                  onClick={placeOrder}
                  sx={{
                    color: "white",
                    backgroundColor: "#f14d54",
                    "&:hover": {
                      backgroundColor: "#f14d54",
                    },
                    marginLeft: "8px",
                    width: "100px",
                  }}
                >
                  Place Order
                </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPg;
