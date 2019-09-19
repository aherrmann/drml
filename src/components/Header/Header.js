import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { AppBar, Toolbar, IconButton, CircularProgress, Avatar, Chip } from "@material-ui/core";
import {
  Menu as MenuIcon,
  ExitToApp as LogoutIcon,
  ArrowBack as ArrowBackIcon,
  Refresh,
} from "@material-ui/icons";
import classNames from "classnames";
import useStyles from "./styles";
import { Badge, Typography } from "../Wrappers/Wrappers";
import { useLayoutState, useLayoutDispatch, toggleSidebar } from "../../context/LayoutContext";
import { useUserDispatch, signOut, useUserState } from "../../context/UserContext";
import { useLedgerState, useLedgerDispatch, fetchContracts, getContracts } from "../../context/LedgerContext";

function Header({ history }) {
  const classes = useStyles();

  // global
  const layoutState = useLayoutState();
  const layoutDispatch = useLayoutDispatch();
  const user = useUserState();
  const userDispatch = useUserDispatch();
  const ledger = useLedgerState();
  const ledgerDispatch = useLedgerDispatch();

  // local
  const [isFetching, setIsFetching] = useState(false);

  const ious = getContracts(ledger, "Iou", "Iou").filter(c => c.argument.owner === user.user);
  const balance = ious.map(c => parseFloat(c.argument.amount.value)).reduce((a,b) => a + b, 0);
  const currency = ious.length > 0 ? ious[0].argument.amount.currency : "";
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          color="inherit"
          onClick={() => toggleSidebar(layoutDispatch)}
          className={classNames(
            classes.headerMenuButton,
            classes.headerMenuButtonCollapse,
          )}
        >
          {layoutState.isSidebarOpened ? (
            <ArrowBackIcon
              classes={{
                root: classNames(
                  classes.headerIcon,
                  classes.headerIconCollapse,
                ),
              }}
            />
          ) : (
            <MenuIcon
              classes={{
                root: classNames(
                  classes.headerIcon,
                  classes.headerIconCollapse,
                ),
              }}
            />
          )}
        </IconButton>
        <Typography variant="h6" weight="medium" className={classes.logotype}>
          DRML
        </Typography>
        <div className={classes.grow} />
        { balance > 0
          ? <Chip label={balance + " " + currency} className={classes.chip} variant="outlined" />
          : <></> }
        <IconButton
          color="inherit"
          aria-haspopup="true"
          onClick={e => fetchContracts(ledgerDispatch, user.token, setIsFetching, () => {})}
          className={classes.headerMenuButton}
        >
          {isFetching
            ? (<CircularProgress className={classes.progress} size={28} color="secondary" />)
            : (<Badge
              badgeContent={ledger.contracts.length}
              color="success"
            >
              <Refresh classes={{ root: classes.headerIcon }} />
            </Badge>)}
        </IconButton>
        <IconButton
          aria-haspopup="true"
          color="inherit"
          className={classes.headerMenuButton}
          aria-controls="profile-menu"
          onClick={e => signOut(userDispatch, history)}
        >
          <LogoutIcon classes={{ root: classes.headerIcon }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default withRouter(Header);