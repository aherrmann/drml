import React from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useLedgerState, getContracts, getContract } from "../../context/LedgerContext";
import Contracts from "../../components/Contracts/Contracts";

function Licenses() {

  const ledger = useLedgerState();
  const licenses = getContracts(ledger, "Book", "BookLicense");
  const isReseller = !!getContract(ledger, "Book", "Reseller");

  return (
    <>
      <PageTitle title="Licenses"/>
      <Contracts
        contracts={licenses}
        columns={[
          isReseller ? [ "Reader", "argument.reader" ] : ["Reseller", "argument.reseller"],
          [ "ISBN", "argument.book.isbn"],
          [ "Title", "argument.book.title" ],
          [ "Author", "argument.book.author" ]
        ]}
        actions={[]}/>
    </>
  );
}

export default Licenses;