import React from 'react';
import { bindAll, debounce } from 'lodash';
import { Link, Route } from 'react-router-dom';
import Book from './Book';
import Bookshelf from './Bookshelf';

import * as BooksAPI from './BooksAPI';
import ShelfEnum from './utils/ShelfEnum';
import './App.css';

function sortBookByTitle(x, y) {
  if (x.title < y.title) return -1;
  if (x.title > y.title) return 1;
  return 0;
}

class BooksApp extends React.Component {

  state = {
    search: '',
    results: [],

    books: []
  }

  constructor(props) {
    super(props);

    bindAll(this,
      'setState',
      'Search',
      'onChangeSearch',
      'ExecuteSearch',
      'BookList',
      'onChangeSelection',
      'onChangeSearchSelection'
    );

    this.debouncedExecuteSearch = debounce(this.ExecuteSearch, 300);
  }

  componentDidMount() {
    BooksAPI.getAll().then(books => {
      this.setState({
        books: books.map(book => {
          return {...book,
            shelfId: ShelfEnum.Id(book.shelf)
          };
        })
      })
    });
  }

  render() {
    const { Search, BookList } = this;

    return (
      <div className="app">
        <Route exact path='/' render={() => (
          <BookList />
        )} />

        <Route path='/search' render={() => (
          <Search />
        )} />
      </div>
    )
  }

  Search() {
    const { search, results } = this.state,
      { onChangeSearch, onChangeSearchSelection: onChange } = this,
      shelves = this.getShelves(),

      searchResults = !results.error && results.map((book) => {
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
              onChange={(e) => onChangeSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">{searchResults}</ol>
        </div>
      </div>
    );
  }

  BookList() {
    const { onChangeSelection } = this,
      { books } = this.state,
      shelves = this.getShelves(),

      bookshelves = ShelfEnum.asList
        .filter(shelfEnum => shelfEnum.id !== ShelfEnum.NONE)
        .map(shelfEnum => Bookshelf({
          shelfId: shelfEnum.id,
          shelfName: shelfEnum.name,
          books: books.filter((book) => book.shelfId === shelfEnum.id).sort(sortBookByTitle),
          shelves,
          onChange: onChangeSelection
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

  getShelves() {
    const { none, currentlyReading, wantToRead, read } = ShelfEnum,
      items = [
        {id: '', value: '', name: 'Move to..', disabled: true},
        {id: currentlyReading.id, value: currentlyReading.id, name: currentlyReading.name},
        {id: wantToRead.id, value: wantToRead.id, name: wantToRead.name},
        {id: read.id, value: read.id, name: read.name},
        {id: none.id, value: none.id, name: none.name},
      ];

    return items;
  }

  onChangeSelection(id, shelfId) {
    const { books } = this.state,
      index = books.findIndex(x => x.id === id);

    books[index].shelfId = Number(shelfId);
    this.setState({books});
  }

  ExecuteSearch() {
    const MAX_RESULTS = 10,
      { search } = this.state,
      { setState } = this;

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

  onChangeSearch(search) {
    this.setState({search}, this.debouncedExecuteSearch);
  }

  onChangeSearchSelection(id, shelfId) {
    const { books, results } = this.state,
      booksId = books.findIndex(x => x.id === id),
      resultsId = results.findIndex(x => x.id === id);

      if (booksId > 0)
        books[booksId].shelfId = Number(shelfId);
      else {
        results[resultsId].shelfId = Number(shelfId);
        books.push(results[resultsId]);
      }
  }

}

export default BooksApp;
