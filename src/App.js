import React from 'react';
import { bindAll, debounce } from 'lodash';
import { Route } from 'react-router-dom';
import BookList from './BookList';
import Search, { executeSearch } from './Search';
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
      'onChangeSelection',
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

  onChangeSearch(search) {
    this.setState({search}, this.executeSearch);
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

  executeSearch = debounce(() => {
    executeSearch(this.state.search, this.setState)
  }, 200)

}

export default BooksApp;
