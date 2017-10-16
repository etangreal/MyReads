import React from 'react'
import { noop } from 'lodash'

const Select = ({
    // parameters
    items=[],
    defaultValue='',
    onChange=noop,

    // context
    Option=noop
}={}) => (
    <select
        defaultValue={defaultValue}
        onChange={(e) => onChange(e.target.value)}
        >{items.map(Option)}</select>
);

const Option = ({id, value, name, disabled}) => {
    const props = {disabled};

    return (
        <option
            key={id}
            value={value}
            {...props}
            >{name}</option>
    );
}

export default (props) => Select({ ...props, Option});
