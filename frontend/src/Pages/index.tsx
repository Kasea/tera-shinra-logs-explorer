import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Main from "./Main";
import Run from "./Run";

const Pages = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/runs/:run">
          <Run />
        </Route>

        <Route path="/">
          <Main />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Pages;
