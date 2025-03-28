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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      
      { path: "/", element: <Home /> },
      { path: "/categories/:categoryName", element: <CategoryPage/> },
      { path: "/search", element: <Search/> },
      { path: "/shop", element: <ShopPage/>},
      { path: "/shop/:id", element: <SingleProduct /> }
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
        { path: '', element: <div>User</div>},
        { path: 'orders', element: <div>yaya</div> },
        { path: 'payments', element: <div>Admin</div> },
        { path: 'profile', element: <div>Admin</div> },
        { path: 'reviews', element: <div>Admin</div> },


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