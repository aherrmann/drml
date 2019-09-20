import React, { useEffect, useState } from "react";

export async function fetchBookData(isbn) {
    var url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;
    var data = await fetch(url)
        .then(result => { return result.json()})
        .then(data => {
            return {"isbn": isbn, "thumbnail": data.items[0].volumeInfo.imageLinks.thumbnail};
        })
        .catch(err => {
            console.log("error fetching " + isbn, err)
            return {"isbn": isbn, "thumbnail": "unable to fetch image"};
    })
    return data;
}

export default function Listings({isbn}) {

    const [book, setBook] = useState({});

    useEffect(() => {
        fetchBookData(isbn)
            .then(book => {
                setBook(book);
            })
    }, [isbn]);

    return (
        <table>
            <tbody>

            <tr>
                <td>{book.isbn}</td>
                <td><img src={book.thumbnail} alt={book.isbn} title={book.isbn}/></td>
            </tr>
            </tbody>
        </table>
        )
}