import React from 'react'
import { noop } from 'lodash'
import Book from './Book'
import { shelves } from './utils/ShelfEnum'

const Bookshelf = ({
  // props
  shelfId,
  shelfName='',
  books=[],
  shelves,
  onChange=noop,

  // context
  Book
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

export default (props) => {
  return Bookshelf({ ...props,
    shelves: props.shelves || shelves(),
    Book: props.Book || Book
  });
};
