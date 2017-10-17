import React from 'react'
import { noop } from 'lodash'
import Select from './Select';

const Book = ({
  // props
  id='',
  shelfId='',
  shelves=[],
  imageLinks={smallThumbnail: ''},
  title='',
  authors=[],
  onChange=noop,

  // context
  Select={}
}={}) => {
  const url = 'url("'+ imageLinks.smallThumbnail + '")';
  const style = {
      width: 128,
      height: 193,
      backgroundImage: url
  };
  const Selection = Select({
      items: shelves,
      defaultValue: shelfId,
      onChange: (shelfId) => onChange(id, shelfId)
  });
  const Authors = authors.map((author, index) => {
    return authors.length === index + 1 ? author : author + ', '
  });

  return (
    <div className="book">
      <div className="book-top">
        <div className="book-cover" style={style} />
        <div className="book-shelf-changer">{Selection}</div>
      </div>
      <div className="book-title">{title}</div>
        <div className="book-authors">{Authors}</div>
    </div>
  );
}

export default (props) => Book({ ...props,
  Select: props.Select || Select
});
