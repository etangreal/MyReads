import React from 'react'
import { noop } from 'lodash'
import Book from './Book'

const Bookshelf = ({
    shelfId,
    shelfName='',
    books=[],
    shelves=[],
    onChange=noop
}={}) => {
    const booklist = books.map((book) => {
        return <li key={book.id}>{Book({...book, shelves, onChange})}</li>
    });

    return (
      <div key={shelfId} className="bookshelf">
        <h2 className="bookshelf-title">{shelfName}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            { booklist }
          </ol>
        </div>
      </div>
    );
}

export default Bookshelf;
