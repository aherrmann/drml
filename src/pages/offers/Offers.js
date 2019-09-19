import React from "react";
import { withRouter } from "react-router-dom";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useLedgerState, getContracts } from "../../context/LedgerContext";
import Contracts from "../../components/Contracts/Contracts";

function Offers({ history }) {

  const ledger = useLedgerState();
  const books = getContracts(ledger, "Main", "Book");

  return (
    <>
      <PageTitle title="Book" button="New Book" onButtonClick={() => history.push("/app/deals/new")}/>
      <Contracts contracts={books} columns={[[ "ISBN", "argument.isbn"], [ "Title", "argument.title" ], [ "Author", "argument.author" ]]}/>
    </>
  );
}

export default withRouter(Offers);