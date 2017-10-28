import React from 'react'
import { bindAll, debounce } from 'lodash'
import { Route } from 'react-router-dom'
import BookList from '../components/BookList'
import Search, { executeSearch } from '../components/Search'
import * as BooksAPI from '../api/BooksAPI'
import ShelfEnum from '../utils/ShelfEnum'
import { findBookIndex } from '../utils/common'
import './App.css'

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
      'onChangeSearch',
      'onChangeBookListSelection',
      'onChangeSearchSelection'
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
    const {
      onChangeSearch,
      onChangeBookListSelection,
      onChangeSearchSelection
    } = this;

    const {
      search,
      results,
      books
    } = this.state;

    return (
      <div className="app">
        <Route exact path='/' render={() => (
          <BookList
            books={books}
            onChange={onChangeBookListSelection} />
        )} />

        <Route path='/search' render={() => (
          <Search
            search={search}
            results={results}
			books={books}
            onChangeSearch={onChangeSearch}
            onChange={onChangeSearchSelection} />
        )} />
      </div>
    )
  }

  onChangeSearch(search) {
    this.setState({search}, this.executeSearch);
  }

  executeSearch = debounce(() => {
    executeSearch(this.state.search, this.setState)
  }, 200)

  onChangeBookListSelection(id, shelfId) {
	const booksId = findBookIndex(this.state.books, id);
	const resultsId = findBookIndex(this.state.results, id);

	let books = JSON.parse(JSON.stringify(this.state.books));
	let results = JSON.parse(JSON.stringify(this.state.results));

    books[booksId].shelfId = Number(shelfId);

	if (resultsId >= 0)
	    results[resultsId].shelfId = Number(shelfId);

    this.setState({books, results});
	BooksAPI.update(books[booksId], ShelfEnum.Str(books[booksId].shelfId))
  }

  onChangeSearchSelection(id, shelfId) {
	const booksId = findBookIndex(this.state.books, id);
	const resultsId = findBookIndex(this.state.results, id);

	let books = JSON.parse(JSON.stringify(this.state.books));
	let results = JSON.parse(JSON.stringify(this.state.results));

    results[resultsId].shelfId = Number(shelfId);

    const book = JSON.parse(JSON.stringify(results[resultsId]));

    if (booksId < 0)
	    books.push(book);
    else
    	books[booksId].shelfId = Number(shelfId);

    this.setState({books, results});
	BooksAPI.update(book, ShelfEnum.Str(book.shelfId))
  }

}

export default BooksApp;
