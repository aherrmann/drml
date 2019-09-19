import React from "react";
import { withRouter } from "react-router-dom";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useLedgerState, getContracts } from "../../context/LedgerContext";
import Contracts from "../../components/Contracts/Contracts";

function Deals({ history }) {

  const ledger = useLedgerState();
  const deals = getContracts(ledger, "Main", "BookDeal");

  return (
    <>
      <PageTitle title="Deals" button="New Deal" onButtonClick={() => history.push("/app/author/newdeal")}/>
      <Contracts
        contracts={deals}
        columns={[["Author", "argument.author"], ["ISBN", "argument.book.isbn"], ["Title", "argument.book.title"], ["Royalties", "argument.royalties"]]}
      />
    </>
  );
}

export default withRouter(Deals)