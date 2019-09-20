import React from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useLedgerState, getContracts } from "../../context/LedgerContext";
import Book from "../../components/Books/Book";
import BookPurchase from "./BookPurchase";

function Listings() {

    const ledger = useLedgerState();
    const listings = getContracts(ledger, "Book", "BookListing");

    return (
        <>
            <PageTitle title="Listings" />
            {listings.map(l => {
            return (
                <div key={l.argument.reseller}>
                    <h1>{l.argument.reseller}</h1>
                    <div>
                    {l.argument.books.map(isbn=> {
                        return (
                            <>
                                <Book isbn={isbn} />
                                <BookPurchase reseller={l.argument.reseller} isbn={isbn}/>
                            </>
                        );
                    })}
                    </div>
                </div>
            )
            })}

        </>
        );

}

export default Listings