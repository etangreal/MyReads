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
    const url = 'url("'+ imageLinks.smallThumbnail + '")',
    style = {
        width: 128,
        height: 193,
        backgroundImage: url
    },

    Selection = Select({
        items: shelves,
        defaultValue: shelfId,
        onChange: (shelfId) => onChange(id, shelfId)
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

export default (props) => Book({ ...props,
    Select: props.Select || Select
});
