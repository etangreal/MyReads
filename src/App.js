import React from 'react';
import { bindAll } from 'lodash';
// import * as BooksAPI from './BooksAPI'
import './App.css';
import SectionEnum from './utils/SectionEnum';

class BooksApp extends React.Component {

  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false
  }

  books = [{
      key: 1,
      url: 'url("http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73-GnPVEyb7MOCxDzOYF1PTQRuf6nCss9LMNOSWBpxBrz8Pm2_mFtWMMg_Y1dx92HT7cUoQBeSWjs3oEztBVhUeDFQX6-tWlWz1-feexS0mlJPjotcwFqAg6hBYDXuK_bkyHD-y&source=gbs_api")',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      section: SectionEnum.CURRENTLY_READING
    }, {
      key: 2,
      url: 'url("http://books.google.com/books/content?id=yDtCuFHXbAYC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72RRiTR6U5OUg3IY_LpHTL2NztVWAuZYNFE8dUuC0VlYabeyegLzpAnDPeWxE6RHi0C2ehrR9Gv20LH2dtjpbcUcs8YnH5VCCAH0Y2ICaKOTvrZTCObQbsfp4UbDqQyGISCZfGN&source=gbs_api")',
      title: 'Ender`s Game',
      author: 'Orson Scott Card',
      section: SectionEnum.CURRENTLY_READING
    }, {
      key: 3,
      url: 'url("http://books.google.com/books/content?id=uu1mC6zWNTwC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73pGHfBNSsJG9Y8kRBpmLUft9O4BfItHioHolWNKOdLavw-SLcXADy3CPAfJ0_qMb18RmCa7Ds1cTdpM3dxAGJs8zfCfm8c6ggBIjzKT7XR5FIB53HHOhnsT7a0Cc-PpneWq9zX&source=gbs_api")',
      title: '1776',
      author: 'David McCullough',
      section: SectionEnum.WANT_TO_READ
    }, {
      key: 4,
      url: 'url("http://books.google.com/books/content?id=wrOQLV6xB-wC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72G3gA5A-Ka8XjOZGDFLAoUeMQBqZ9y-LCspZ2dzJTugcOcJ4C7FP0tDA8s1h9f480ISXuvYhA_ZpdvRArUL-mZyD4WW7CHyEqHYq9D3kGnrZCNiqxSRhry8TiFDCMWP61ujflB&source=gbs_api)',
      title: 'Harry Potter and the Sorcerer`s Stone',
      author: 'J.K. Rowling',
      section: SectionEnum.WANT_TO_READ
    }, {
      key: 5,
      url: 'url("http://books.google.com/books/content?id=pD6arNyKyi8C&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE70Rw0CCwNZh0SsYpQTkMbvz23npqWeUoJvVbi_gXla2m2ie_ReMWPl0xoU8Quy9fk0Zhb3szmwe8cTe4k7DAbfQ45FEzr9T7Lk0XhVpEPBvwUAztOBJ6Y0QPZylo4VbB7K5iRSk&source=gbs_api)',
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      section: SectionEnum.READ
    }, {
      key: 6,
      url: 'url("http://books.google.com/books/content?id=1q_xAwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE712CA0cBYP8VKbEcIVEuFJRdX1k30rjLM29Y-dw_qU1urEZ2cQ42La3Jkw6KmzMmXIoLTr50SWTpw6VOGq1leINsnTdLc_S5a5sn9Hao2t5YT7Ax1RqtQDiPNHIyXP46Rrw3aL8&source=gbs_api)',
      title: 'Oh, the Places You`ll Go!',
      author: 'Seuss',
      section: SectionEnum.READ
    }, {
      key: 7,
      url: 'url("http://books.google.com/books/content?id=32haAAAAMAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72yckZ5f5bDFVIf7BGPbjA0KYYtlQ__nWB-hI_YZmZ-fScYwFy4O_fWOcPwf-pgv3pPQNJP_sT5J_xOUciD8WaKmevh1rUR-1jk7g1aCD_KeJaOpjVu0cm_11BBIUXdxbFkVMdi&source=gbs_api)',
      title: 'The Adventures of Tom Sawyer',
      author: 'Mark Twain',
      section: SectionEnum.READ
    }
  ];

  constructor(props) {
    super(props);

    bindAll(this,
      'Search',
      'BookList',
      'Bookshelf',
      'Book',
      'Select',
      'addBook',
      'closeSearch'
    );
  }

  render() {
    const { Search, BookList } = this;

    return (
      <div className="app">
        { this.state.showSearchPage ? Search() : BookList() }
      </div>
    )
  }

  Search() {
    const { closeSearch } = this;

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <a className="close-search" onClick={closeSearch}>Close</a>
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
    const { addBook, Bookshelf, books } = this,
      bookshelves = SectionEnum.asList.map(section => Bookshelf({
        key: section.key,
        title: section.name,
        books: books.filter((book) => book.section === section.key)
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
          <a onClick={addBook}>Add a book</a>
        </div>
      </div>
    )
  }

  Bookshelf({key, title, books}) {
    const { Book } = this,
      booklist = books.map((book) => {
        return <li key={book.key}>{Book(book)}</li>
      });

    return (
      <div key={key} className="bookshelf">
        <h2 className="bookshelf-title">{title}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            { booklist }
          </ol>
        </div>
      </div>
    );
  }

  Book({url, title, author}) {
    const { Select } = this;

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
            { Select() }
          </div>
        </div>
        <div className="book-title">{title}</div>
        <div className="book-authors">{author}</div>
      </div>
    );
  }

  Select() {
    return (
      <select>
        <option value="none" disabled>Move to...</option>
        <option value="currentlyReading">Currently Reading</option>
        <option value="wantToRead">Want to Read</option>
        <option value="read">Read</option>
        <option value="none">None</option>
      </select>
    );
  }

  // ----------------------------------------------------------------------------------------------

  closeSearch() {
    this.setState({
      showSearchPage: false
    });
  }

  addBook() {
    this.setState({
      showSearchPage: true
    });
  }

}

export default BooksApp;
