import React from 'react'
import { bindAll, debounce } from 'lodash'
import { Route } from 'react-router-dom'
import BookList from '../components/BookList'
import Search, { executeSearch } from '../components/Search'
import * as BooksAPI from '../api/BooksAPI'
import ShelfEnum from '../utils/ShelfEnum'
import { findBook } from '../utils/common'
import './App.css'

const updateState = (id, book, result) => state => ({
  books: state.books.filter(b => b.id !== id).concat(book ? [book] : []),
  results: state.results.filter(b => b.id !== id).concat(result ? [result] : [])
})

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
	const shelf = ShelfEnum.Str(shelfId);
	let book = findBook(this.state.books, id);
	let result = findBook(this.state.results, id);

	book.shelfId = Number(shelfId);
	if (result) result.shelfId = Number(shelfId);

    BooksAPI.update(book, shelf).then(() => this.setState(updateState(id, book, result)));
  }

  onChangeSearchSelection(id, shelfId) {
	const shelf = ShelfEnum.Str(shelfId);
	let book = findBook(this.state.books, id);
	let result = findBook(this.state.results, id);

    result.shelfId = Number(shelfId);
    if (book)
		book.shelfId = Number(shelfId);
    else
		book = Object.assign({}, result);

    BooksAPI.update(book, shelf).then(() => this.setState(updateState(id, book, result)));
  }

}

export default BooksApp;
