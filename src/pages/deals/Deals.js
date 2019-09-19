import React from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useLedgerState, getContracts, getContract } from "../../context/LedgerContext";
import Contracts from "../../components/Contracts/Contracts";

function Deals() {

  const ledger = useLedgerState();
  const isAuthor = !!getContract(ledger, "Book", "Author");
  const deals = getContracts(ledger, "Book", "BookDeal");

  return (
    <>
      <PageTitle title="Deals" />
      <Contracts
        contracts={deals}
        columns={[
          isAuthor ? ["Publisher", "argument.publisher"] : ["Author", "argument.author"],
          ["ISBN", "argument.book.isbn"],
          ["Title", "argument.book.title"],
          ["Royalties", "argument.royalties"]
        ]}
      />
    </>
  );
}

export default Deals