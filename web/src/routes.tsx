import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import CreatePoint from "./pages/CreatePoint";
import Home from "./pages/Home";

const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={Home} path="/" exact />
      <Route component={CreatePoint} path="/create-point" exact />
    </BrowserRouter>
  );
};

export default Routes;
