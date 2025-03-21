import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/features/cart/cartSlice";


const TestCart = () => {
  const dispatch = useDispatch(); // Get the dispatch function
  const cart = useSelector((state) => state.cart.products); // Get the cart state

  const handleAddToCart = (id, name, price) => {
    dispatch(addToCart({ _id: id, name, price })); // Dispatch the addToCart action
  };

  return (
    <div>
      <h2>Redux Cart Test</h2>
      <button onClick={() => handleAddToCart("1", "Item 1", 100)}>
        Add Item 1
      </button>
      <button onClick={() => handleAddToCart("2", "Item 2", 150)}>
        Add Item 2
      </button>

      <h3>Cart Items:</h3>
      <pre>{JSON.stringify(cart, null, 2)}</pre>
    </div>
  );
};

export default TestCart;
