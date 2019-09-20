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
                setBook({"isbn": "error", "title" : "error", "thumbnail": "error"})
        })
        return data;
    }

    useEffect(() => {
        fetchBookData()
    }, []);

    return (<div>
        <img src={book.thumbnail} alt={book.title} title={book.title}/>
        {book.title}
        </div>)
}