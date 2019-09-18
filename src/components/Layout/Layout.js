import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import classnames from "classnames";
import useStyles from "./styles";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { useLayoutState } from "../../context/LayoutContext";
import Contracts from "../../pages/contracts/Contracts";
import Tab1 from "../../pages/tab1/Tab1";
import Tab2 from "../../pages/tab2/Tab2";
import Tab3 from "../../pages/tab3/Tab3";

function Layout(props) {
  const classes = useStyles();
  const layoutState = useLayoutState();

  return (
    <div className={classes.root}>
        <>
          <Header />
          <Sidebar />
          <div
            className={classnames(classes.content, {
              [classes.contentShift]: layoutState.isSidebarOpened,
            })}
          >
            <div className={classes.fakeToolbar} />
            <Switch>
              <Route path="/app/contracts" component={Contracts} />
              <Route path="/app/tab1" component={Tab1} />
              <Route path="/app/tab2" component={Tab2} />
              <Route path="/app/tab3" component={Tab3} />
            </Switch>
          </div>
        </>
    </div>
  );
}

export default withRouter(Layout);
