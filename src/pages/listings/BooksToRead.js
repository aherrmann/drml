import React, { useState } from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useLedgerState, getContracts } from "../../context/LedgerContext";
import Book from "../../components/Books/Book";
import { Button } from "../../components/Wrappers/Wrappers";

function BooksToRead() {

    const ledger = useLedgerState();
    const permissions = getContracts(ledger, "Book", "ReadingPermission");
    const [book, setBook] = useState({});

    function read(isbn, expired) {
        var state = book
        if (!book[isbn]) {
            var lorem = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. ";
            state = { ...book, [isbn]: lorem}
            if (expired) {
                setTimeout(function() {
                    state = { ...book, [isbn]: "!!! READING PERMISSION EXPIRED !!!"}
                    setBook(state)
                }, 5000);
            }
            setBook(state)
        }
    }


    return (
        <>
            <PageTitle title="Books to read" />
            {permissions.map(l => {
            return (
                <div key={l.argument.book.isbn}>

                        <Book isbn={l.argument.book.isbn} />
                        <Button onClick={() => read(l.argument.book.isbn, l.argument.expired)}>READ</Button>
                        {console.log("isbn", l.argument.book.isbn)}
                        <div>{book[l.argument.book.isbn]}</div>
                </div>
            )
            })}

        </>
        );

}

export default BooksToRead