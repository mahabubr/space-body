import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home/Home";
import Simulator from "../pages/simulator/Simulator";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/simulator",
    element: <Simulator />,
  },
]);

export default router;
