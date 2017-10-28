import React from 'react'
import { Link } from 'react-router-dom'
import { noop } from 'lodash'
import ShelfEnum, { shelves } from '../../utils/ShelfEnum'
import { sortBooksByTitle } from '../../utils/common'
import Bookshelf from '../Bookshelf'

const BookList = ({
  // props
  books=[],
  shelves,
  onChange=noop,

  // context
  ShelfEnum,
  Bookshelf
}={}) => {
  const bookshelves = ShelfEnum.asList
      .filter(shelfEnum => shelfEnum.id !== ShelfEnum.NONE)
      .map(shelfEnum => Bookshelf({
        shelfId: shelfEnum.id,
        shelfName: shelfEnum.name,
        books: books.filter((book) => book.shelfId === shelfEnum.id).sort(sortBooksByTitle),
        shelves,
        onChange
      }));

  return (
    <div className="list-books">
      <div className="list-books-title">
        <h1>MyReads</h1>
      </div>
      <div className="list-books-content">
        <div>
          {bookshelves}
        </div>
      </div>
      <div className="open-search">
        <Link to="/search">Add a book</Link>
      </div>
    </div>
  )
}

export default (props) => {
  return BookList({ ...props,
    shelves: props.shelves || shelves(),
    ShelfEnum: props.ShelfEnum || ShelfEnum,
    Bookshelf: props.Bookshelf || Bookshelf
  });
};
