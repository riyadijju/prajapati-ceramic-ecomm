import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import CategoryPage from "../pages/category/CategoryPage";
import Search from "../pages/search/Search";
import ShopPage from "../pages/shop/ShopPage";
import SingleProduct from "../pages/shop/productDetails/SingleProduct";
import Login from "../components/Login";
import Register from "../components/Register";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import UserDMain from "../pages/dashboard/user/dashboard/UserDMain";
import ErrorPage from "../pages/ErrorPage";
import PaymentSuccess from "../components/PaymentSuccess";
// import UserOrders from "../pages/dashboard/user/UserOrders";
// import OrderDetails from "../pages/dashboard/user/OrderDetails";
// import UserPayments from "../pages/dashboard/user/UserPayments";
// import UserReviews from "../pages/dashboard/user/UserReviews";
// import UserProfile from "../pages/dashboard/user/UserProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage />,
    children: [
      
      { path: "/", element: <Home /> },
      { path: "/categories/:categoryName", element: <CategoryPage/> },
      { path: "/search", element: <Search/> },
      { path: "/shop", element: <ShopPage/>},
      { path: "/shop/:id", element: <SingleProduct /> },
      {
        path: "/success",
        element: <PaymentSuccess/>
      },
    ]
  },
  {
        path: "/login",
        element: <Login/>
  },
  {
    path: "/register",
    element: <Register/>
  },
  // Dashboard Routes Starts here
  {
    path: "/dashboard",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
        // user routes
        { path: '', element: <UserDMain/>},
        { path: 'orders', element: <div>blah</div> },
        { path: 'payments', element: <div>blah</div>},
        { path: 'profile', element: <div>blah</div> },
        { path: 'reviews', element: <div>blah</div> },


        // admin routes (only accessible by admin) Todo: private routes with role field
        {
            path: "admin",
            element: <PrivateRoute role="admin"><div>Admin</div></PrivateRoute>
        },
        {
            path: "add-product",

            element: <PrivateRoute role="admin"><div>Admin Add</div></PrivateRoute>
        },
        {
            path: "manage-products",
            element: <PrivateRoute role="admin"><div>manage</div></PrivateRoute>

        },
        {
            path: "update-product/:id",
            element: <PrivateRoute role="admin"><div>update</div></PrivateRoute>
        },
        { path: "users", element: <PrivateRoute role="admin"><div>Users</div></PrivateRoute> },
        { path: "manage-orders", 
        element: <PrivateRoute role="admin">
            {/* <ManageOrders/> */}
            </PrivateRoute> 
        },
    ]
}

]);

export default router