import React from 'react'
import { Link } from 'react-router-dom'
import { noop } from 'lodash'
import * as BooksAPI from '../../api/BooksAPI';
import Book from '../Book'
import ShelfEnum, { shelves } from '../../utils/ShelfEnum'

export const executeSearch = (search, setState) => {
  const MAX_RESULTS = 10;

  if (!search)
    setState({results: []})
  else
    BooksAPI
      .search(search, MAX_RESULTS)
      .then(results => {
        if (!results.error) {
          results.map(book => book.shelfId = ShelfEnum.Id(book.shelf))
          setState({results})
        } else {
          setState({results: []})
        }
      });
}

const Search = ({
  // props
  search='',
  results=[],
  books=[],
  shelves,
  onChangeSearch=noop,
  onChange=noop,

  // context
  Book,
  Link
}={}) => {
  const searchResults = !results.error && results.map((book) => {
    const index = books.findIndex(search => search.id === book.id);

    if (index >= 0)
      	book.shelfId = books[index].shelfId;

    if (!book.shelfId) 
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
