import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import classnames from "classnames";
import useStyles from "./styles";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { useLayoutState } from "../../context/LayoutContext";
import NewProposal from "../../pages/proposals/NewProposal";
import NewBook from "../../pages/books/NewBook";
import Deals from "../../pages/deals/Deals";
import Proposals from "../../pages/proposals/Proposals";
import { useLedgerState, getContract } from "../../context/LedgerContext";
import Books from "../../pages/books/Books";
import { BorderAll, MenuBook, NoteAdd, CheckCircle } from "@material-ui/icons";
import All from "../../pages/all/All";

function Layout(props) {
  const classes = useStyles();
  const layoutState = useLayoutState();

  const ledger = useLedgerState();
  const isAuthor = !!getContract(ledger, "Main", "Author");
  const isPublisher = !!getContract(ledger, "Main", "Publisher");

  const structure = [
    { key : "all", label: "Contracts", path: "/app/all", component: All, icon: <BorderAll /> }
  ];

  if (isAuthor) {
    structure.push({ key : "newbook",     label: "NewBook",     path: "/app/books/new",      component: NewBook,     icon: <></>, hideInSidebar: true });
    structure.push({ key : "newproposal", label: "NewProposal", path: "/app/proposals/new",  component: NewProposal, icon: <></>, hideInSidebar: true });
    structure.push({ key : "books",       label: "Books",       path: "/app/books",          component: Books,       icon: <MenuBook /> });
    structure.push({ key : "proposals",   label: "Proposals",   path: "/app/proposals",      component: Proposals,   icon: <NoteAdd /> });
    structure.push({ key : "deals",       label: "Deals",       path: "/app/deals",          component: Deals,       icon: <CheckCircle /> });
  } else if (isPublisher) {
    structure.push({ key : "proposals",   label: "Proposals",   path: "/app/proposals",      component: Proposals,   icon: <NoteAdd /> });
    structure.push({ key : "deals",       label: "Deals",       path: "/app/deals",          component: Deals,       icon: <CheckCircle /> });
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
              { structure.map(s => (<Route {...s} />)) }
            </Switch>
          </div>
        </>
    </div>
  );
}

export default withRouter(Layout);
