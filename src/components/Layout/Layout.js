import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import classnames from "classnames";
import useStyles from "./styles";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { useLayoutState } from "../../context/LayoutContext";
import NewProposal from "../../pages/proposals/NewProposal";
import Deals from "../../pages/deals/Deals";
import Proposals from "../../pages/proposals/Proposals";
import { useLedgerState, getContract } from "../../context/LedgerContext";
import { MenuBook, NoteAdd, CheckCircle, AttachMoney, DynamicFeed, Reorder, Money, TrendingDown } from "@material-ui/icons";
import All from "../../pages/all/All";
import Offers from "../../pages/offers/Offers";
import NewOffer from "../../pages/offers/NewOffer";
import Volumes from "../../pages/volumes/Volumes";
import Licenses from "../../pages/licenses/Licenses";
import Royalties from "../../pages/royalties/Royalties";
import NewBankruptcy from "../../pages/bankruptcy/NewBankruptcy";
import Bankruptcy from "../../pages/bankruptcy/Bankruptcy";
import Listings from "../../pages/listings/Listings";
import Purchases from "../../pages/purchases/Purchases";
import BooksToRead from "../../pages/listings/BooksToRead";

function Layout(props) {
  const classes = useStyles();
  const layoutState = useLayoutState();

  const ledger = useLedgerState();
  const isAuthor = !!getContract(ledger, "Book", "Author");
  const isPublisher = !!getContract(ledger, "Book", "Publisher");
  const isReseller = !!getContract(ledger, "Book", "Reseller");
  const hasBankruptcy = !!getContract(ledger, "Bankruptcy", "BankruptcyAgreement") || !!getContract(ledger, "Bankruptcy", "BankruptcyDeclaration");

  const structure = [
    { key : "all", label: "Contracts", path: "/app/all", component: All, icon: <Reorder /> }
  ];

  if (isAuthor) {
    structure.push({ key : "newproposal",   label: "NewProposal", path: "/app/proposals/new",  component: NewProposal,   icon: <></>, hideInSidebar: true });
    structure.push({ key : "proposals",     label: "Proposals",   path: "/app/proposals",      component: Proposals,     icon: <NoteAdd /> });
    structure.push({ key : "deals",         label: "Deals",       path: "/app/deals",          component: Deals,         icon: <CheckCircle /> });
    structure.push({ key : "royalties",     label: "Royalties",   path: "/app/royalties",      component: Royalties,     icon: <AttachMoney /> });
  } else if (isPublisher) {
    structure.push({ key : "proposals",     label: "Proposals",   path: "/app/proposals",      component: Proposals,     icon: <NoteAdd /> });
    structure.push({ key : "deals",         label: "Deals",       path: "/app/deals",          component: Deals,         icon: <CheckCircle /> });
    structure.push({ key : "newoffer",      label: "NewOffer",    path: "/app/offers/new",     component: NewOffer,      icon: <></>, hideInSidebar: true });
    structure.push({ key : "offers",        label: "Offers",      path: "/app/offers",         component: Offers,        icon: <Money /> });
    structure.push({ key : "royalties",     label: "Royalties",   path: "/app/royalties",      component: Royalties,     icon: <AttachMoney /> });
    if (hasBankruptcy) structure.push({ key : "bankruptcy",    label: "Bankruptcy",  path: "/app/bankruptcy",     component: Bankruptcy,    icon: <TrendingDown /> });
  } else if (isReseller) {
    structure.push({ key : "offers",        label: "Offers",      path: "/app/offers",         component: Offers,        icon: <Money /> });
    structure.push({ key : "volumes",       label: "Volumes",     path: "/app/volumes",        component: Volumes,       icon: <DynamicFeed /> });
    structure.push({ key : "licenses",      label: "Licenses",    path: "/app/licenses",       component: Licenses,      icon: <MenuBook /> });
    structure.push({ key : "newbankruptcy", label: "Bankruptcy",  path: "/app/bankruptcy/new", component: NewBankruptcy, icon: <TrendingDown />, hideInSidebar: true });
    structure.push({ key : "purchases",   label: "Purchases",     path: "/app/purchases",      component: Purchases,   icon: <AttachMoney /> });
    if (hasBankruptcy) structure.push({ key : "bankruptcy",    label: "Bankruptcy",  path: "/app/bankruptcy",     component: Bankruptcy,    icon: <TrendingDown /> });
  } else {
    structure.push({ key : "licenses",      label: "Licenses",    path: "/app/licenses",       component: Licenses,      icon: <MenuBook /> });
    structure.push({ key : "listings",      label: "Book Listings", path: "/app/listings",       component: Listings,    icon: <MenuBook /> });
    structure.push({ key : "toRead",      label: "Books To Read", path: "/app/bookstoread",       component: BooksToRead,    icon: <MenuBook /> });
    if (hasBankruptcy) structure.push({ key : "bankruptcy",    label: "Bankruptcy",  path: "/app/bankruptcy",     component: Bankruptcy,    icon: <TrendingDown /> });
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
