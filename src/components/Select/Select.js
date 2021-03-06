import React from 'react'
import { noop } from 'lodash'

const Option = ({
  // props
  id,
  value,
  name,
  disabled
}={}) => {
  const props = {disabled};

  return (
    <option
      key={id}
      value={value}
      {...props}
    >{name}</option>
  );
}

const Select = ({
  // props
  items=[],
  defaultValue='',
  onChange=noop,

  // context
  Option
}={}) => (
  <select
    defaultValue={defaultValue}
    onChange={(e) => onChange(e.target.value)}
  >{items.map(Option)}</select>
);

export default (props) => Select({ ...props,
    Option: props.Option || Option
});
