import React from 'react';
import { bindAll, debounce } from 'lodash';
import { Route } from 'react-router-dom';
import BookList from './BookList';
import Search from './Search';

import * as BooksAPI from './BooksAPI';
import ShelfEnum from './utils/ShelfEnum'
import './App.css';

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
      'ExecuteSearch',
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
    const { onChangeSelection, onChangeSearch, onChangeSearchSelection } = this,
      { search, results, books } = this.state;

    return (
      <div className="app">
        <Route exact path='/' render={() => (
          <BookList
            books={books}
            onChange={onChangeSelection} />
        )} />

        <Route path='/search' render={() => (
          <Search
            search={search}
            results={results}
            onChangeSearch={onChangeSearch}
            onChange={onChangeSearchSelection} />
        )} />
      </div>
    )
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
