import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import classnames from "classnames";
import useStyles from "./styles";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { useLayoutState } from "../../context/LayoutContext";
import Contracts from "../../pages/contracts/Contracts";
import NewProposal from "../../pages/author/NewProposal";
import NewBook from "../../pages/author/NewBook";
import Deals from "../../pages/author/Deals";
import Proposals from "../../pages/author/Proposals";
import { useLedgerState, getContract } from "../../context/LedgerContext";
import Books from "../../pages/author/Books";
import { BorderAll, MenuBook, NoteAdd, CheckCircle } from "@material-ui/icons";

function Layout(props) {
  const classes = useStyles();
  const layoutState = useLayoutState();

  const ledger = useLedgerState();
  const isAuthor = !!getContract(ledger, "Main", "Author");

  const structure = [
    { key : "contracts", label: "Contracts", path: "/app/contracts", component: Contracts, icon: <BorderAll /> }
  ];

  if (isAuthor) {
    structure.push({ key : "newbook",     label: "NewBook",     path: "/app/author/books/new",      component: NewBook,     icon: <></>, hideInSidebar: true });
    structure.push({ key : "newproposal", label: "NewProposal", path: "/app/author/proposals/new",  component: NewProposal, icon: <></>, hideInSidebar: true });
    structure.push({ key : "books",       label: "Books",       path: "/app/author/books",          component: Books,       icon: <MenuBook /> });
    structure.push({ key : "proposals",   label: "Proposals",   path: "/app/author/proposals",      component: Proposals,   icon: <NoteAdd /> });
    structure.push({ key : "deals",       label: "Deals",       path: "/app/author/deals",          component: Deals,       icon: <CheckCircle /> });
  }

  return (
    <div className={classes.root}>
        <>
          <Header />
          <Sidebar structure={structure} />
          <div
            className={classnames(classes.content, {
              [classes.contentShift]: layoutState.isSidebarOpened,
            })}
          >
            <div className={classes.fakeToolbar} />
            <Switch>
              { structure.map(s => (<Route path={s.path} component={s.component} />)) }
            </Switch>
          </div>
        </>
    </div>
  );
}

export default withRouter(Layout);
