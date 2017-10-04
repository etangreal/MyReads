import React from 'react';
import { bindAll, noop } from 'lodash';
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
    books: []
  }

  constructor(props) {
    super(props);

    bindAll(this,
      'Search',
      'BookList',
      'Bookshelf',
      'Book',
      'Selection',
      'Select'
    );
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
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/" className="close-search">Close</Link>
          <div className="search-books-input-wrapper">
            {/*
              NOTES: The search from BooksAPI is limited to a particular set of search terms.
              You can find these search terms here:
              https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

              However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
              you don't find a specific author or title. Every search is limited by search terms.
            */}
            <input type="text" placeholder="Search by title or author"/>
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid"></ol>
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
    const { Book } = this,
      booklist = books.map((book) => {
        return <li key={book.id}>{Book(book)}</li>
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

  Book({id, imageLinks, title, authors, shelfId}) {
    const { Selection } = this,
      url = 'url("'+ imageLinks.smallThumbnail + '")';

    return (
      <div className="book">
        <div className="book-top">
          <div className="book-cover"
            style={{
              width: 128,
              height: 193,
              backgroundImage: url
            }}>
          </div>
          <div className="book-shelf-changer">
            { Selection({id, shelfId}) }
          </div>
        </div>
        <div className="book-title">{title}</div>
        <div className="book-authors">{authors.map((author, index) => {
          return authors.length === index + 1 ? author : author + ', '
        })}</div>
      </div>
    );
  }

  Selection({id, shelfId}) {
    const { Select, Option } = this,
      items = this.SelctionItems(),
      onChange = this.onSelectionChange.bind(this, id);

    return Select({items, defaultValue: shelfId, onChange}, {Option});
  }

  SelctionItems() {
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

  onSelectionChange(id, shelfId) {
    const { books } = this.state,
      index = books.findIndex(x => x.id === id);

    books[index].shelfId = Number(shelfId);
    this.setState({books});
  }

  Select({items=[], defaultValue='', onChange=noop}={}, {Option=noop}={}) {
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

}

export default BooksApp;
