import React, { useEffect, useState } from "react";

export default function Listings({isbn}) {

    const [book, setBook] = useState({});

    async function fetchBookData() {
        var url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;
        var data = await fetch(url)
            .then(result => { return result.json()})
            .then(data => {
                console.log("data", data)
                setBook({"isbn": isbn, "title" : data.items[0].volumeInfo.title, "thumbnail": data.items[0].volumeInfo.imageLinks.thumbnail})
            })
            .catch(err => {
                console.log("error fetching " + isbn, err)
                setBook({"isbn": isbn, "title" : "unable to fetch title", "thumbnail": "unknown image"})
        })
        return data;
    }

    useEffect(() => {
        fetchBookData()
    }, []);

    return (
        <table>
            <tr>
                <td>{book.title}</td>
                <td>{book.isbn}</td>
                <td><img src={book.thumbnail} alt={book.title} title={book.title}/></td>
            </tr>
        </table>
        )
}