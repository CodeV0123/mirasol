import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { store } from "./services/store";
import { Provider } from "react-redux";
import HomePage from "./routes/home.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Loader from "./layouts/Loader.jsx";
// import VideoBackground from "./layouts/VideoBackground.jsx";

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <VideoBackground />,
  // },
  {
    path: "/",
    element: <HomePage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <Loader>
      <RouterProvider router={router} />
    </Loader>
  </Provider>
);
