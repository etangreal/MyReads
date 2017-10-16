import React from 'react';
import { bindAll, noop, debounce } from 'lodash';
import { Link, Route } from 'react-router-dom';

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
      'Bookshelf',
      'Book',
      'Select',
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
      { onChangeSearch, Book, onChangeSearchSelection: onChange } = this,

      searchResults = !results.error && results.map((book) => {
        book.shelfId = ShelfEnum.Id(book.shelf);
        return <li key={book.id}>{Book({...book, onChange})}</li>
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
    const { Bookshelf } = this,
      { books } = this.state,

      bookshelves = ShelfEnum.asList
        .filter(shelfEnum => shelfEnum.id !== ShelfEnum.NONE)
        .map(shelfEnum => Bookshelf({
          shelfId: shelfEnum.id,
          shelfName: shelfEnum.name,
          books: books.filter((book) => book.shelfId === shelfEnum.id).sort(sortBookByTitle)
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

  Bookshelf({shelfId, shelfName, books}) {
    const { Book, onChangeSelection: onChange } = this,

      booklist = books.map((book) => {
        return <li key={book.id}>{Book({...book, onChange})}</li>
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

  Book({
    id='',
    shelfId='',
    imageLinks={smallThumbnail: ''},
    title='',
    authors=[],
    onChange=noop
  }={}) {
    const { Select, Option } = this,
      url = 'url("'+ imageLinks.smallThumbnail + '")',
      style = {
        width: 128,
        height: 193,
        backgroundImage: url
      },

      Selection = Select({
        items: this.getShelves(),
        defaultValue: shelfId,
        onChange: (shelfId) => onChange(id, shelfId),
        Option
      });

    return (
      <div className="book">
        <div className="book-top">
          <div className="book-cover"
            style={style}>
          </div>
          <div className="book-shelf-changer">
            {Selection}
          </div>
        </div>
        <div className="book-title">{title}</div>
        <div className="book-authors">{authors.map((author, index) => {
          return authors.length === index + 1 ? author : author + ', '
        })}</div>
      </div>
    );
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

  Select({
    items=[],
    defaultValue='',
    onChange=noop,
    Option=noop
  }={}) {
    return (
      <select
        defaultValue={defaultValue}
        onChange={(e) => onChange(e.target.value)}
      >{items.map(Option)}</select>
    );
  }

  Option({id, value, name, disabled}) {
    const props = {disabled};

    return (
      <option
        key={id}
        value={value}
        {...props}
      >{name}</option>
    );
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
