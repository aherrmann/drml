import React from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useLedgerState, getContracts } from "../../context/LedgerContext";
import Contracts from "../../components/Contracts/Contracts";

function Deals() {

  const ledger = useLedgerState();
  const deals = getContracts(ledger, "Main", "BookDeal");

  return (
    <>
      <PageTitle title="Deals" />
      <Contracts
        contracts={deals}
        columns={[
          ["Author", "argument.author"],
          ["ISBN", "argument.book.isbn"],
          ["Title", "argument.book.title"],
          ["Royalties", "argument.royalties"]
        ]}
      />
    </>
  );
}

export default Deals