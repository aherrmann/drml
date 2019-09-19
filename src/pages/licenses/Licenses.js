import React from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useLedgerState, getContracts, getContract } from "../../context/LedgerContext";
import Contracts from "../../components/Contracts/Contracts";

function Licenses({ history }) {

  const ledger = useLedgerState();
  const licenses = getContracts(ledger, "Book", "BookLicense");
  const isReseller = !!getContract(ledger, "Book", "Reseller");
  function resellerOrReaderColumn() {
    if (isReseller) return [ "Reader", "argument.reader" ]
     return ["Reseller", "argument.reseller"]
  }

  return (
    <>
      <PageTitle title="Licenses"/>
      <Contracts
        contracts={licenses}
        columns={[
          resellerOrReaderColumn(),
          [ "ISBN", "argument.book.isbn"],
          [ "Title", "argument.book.title" ],
          [ "Author", "argument.book.author" ]
        ]}
        actions={[]}/>
    </>
  );
}

export default Licenses;