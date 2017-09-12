const Props = {
    1: {key: 1, enum: 'CURRENTLY_READING', name: 'Currently Reading'},
    2: {key: 2, enum: 'WANT_TO_READ', name: 'Want to Read'},
    3: {key: 3, enum: 'READ', name: 'Read'}
  },

  Enum = {
    CURRENTLY_READING: 1,
    WANT_TO_READ: 2,
    READ: 3,
    props: Props,
    asList: Object.values(Props)
  };

export default Enum;
