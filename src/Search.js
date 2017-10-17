import React from 'react'
import { Link } from 'react-router-dom'
import { noop } from 'lodash'
import Book from './Book'
import ShelfEnum, { shelves } from './utils/ShelfEnum'

const Search = ({
  // props
  search='',
  results=[],
  shelves=[],
  onChangeSearch=noop,
  onChange=noop,

  // context
  Book={},
  Link={}
}={}) => {
  const searchResults = !results.error && results.map((book) => {
    book.shelfId = ShelfEnum.Id(book.shelf);
    return <li key={book.id}>{Book({...book, shelves, onChange})}</li>
  });

  return (
    <div className="search-books">
      <div className="search-books-bar">
        <Link to="/" className="close-search">Close</Link>
        <div className="search-books-input-wrapper">
        <input
          type="text"
          placeholder="Search by title or author"
          value={search}
          onChange={(e) => onChangeSearch(e.target.value)} />
        </div>
      </div>
      <div className="search-books-results">
        <ol className="books-grid">{searchResults}</ol>
      </div>
    </div>
  );
}

export default (props) => {
  return Search({ ...props,
    shelves: props.shelves || shelves(),
    Book: props.Book || Book,
    Link: props.Link || Link
  });
};
