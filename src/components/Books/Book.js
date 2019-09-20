import React, { useEffect, useState } from "react";

export default function Listings({isbn}) {

    const [book, setBook] = useState({});

    async function fetchBookData() {
        var url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;
        var data = await fetch(url)
            .then(result => { return result.json()})
            .then(data => {
                setBook({"isbn": isbn, "title" : data.items[0].volumeInfo.title, "thumbnail": data.items[0].volumeInfo.imageLinks.thumbnail})
            })
            .catch(err => {
                console.log("error fetching " + isbn, err)
                setBook({"isbn": isbn, "thumbnail": "unable to fetch image"})
        })
        return data;
    }

    useEffect(() => {
        fetchBookData()
    }, []);

    return (
        <table>
            <tr>
                <td>{book.isbn}</td>
                <td><img src={book.thumbnail} alt={book.isbn} title={book.isbn}/></td>
            </tr>
        </table>
        )
}