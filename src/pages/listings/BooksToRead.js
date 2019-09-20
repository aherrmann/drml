import React from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useLedgerState, getContracts } from "../../context/LedgerContext";
import Book from "../../components/Books/Book";

function BooksToRead() {

    const ledger = useLedgerState();
    const permissions = getContracts(ledger, "Book", "ReadingPermission");

    return (
        <>
            <PageTitle title="Books to read" />
            {permissions.map(l => {
            return (
                <div key={l.argument.reseller}>
                    <h1>{l.argument.reseller}</h1>
                    <div>
                    <Book isbn={l.argument.book.isbn} />
                    </div>
                </div>
            )
            })}

        </>
        );

}

export default BooksToRead