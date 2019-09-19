import React from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useLedgerState, getContracts } from "../../context/LedgerContext";
import Contracts from "../../components/Contracts/Contracts";

function Licenses({ history }) {

  const ledger = useLedgerState();
  const licenses = getContracts(ledger, "Main", "BookLicense");
  
  return (
    <>
      <PageTitle title="Licenses"/>
      <Contracts
        contracts={licenses}
        columns={[
          [ "Reader", "argument.reader" ],
          [ "ISBN", "argument.book.isbn"],
          [ "Title", "argument.book.title" ],
          [ "Author", "argument.book.author" ]
        ]}
        actions={[]}/>
    </>
  );
}

export default Licenses;