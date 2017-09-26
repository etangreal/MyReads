const Enum = {
    NONE: 0,
    CURRENTLY_READING: 1,
    WANT_TO_READ: 2,
    READ: 3
  },

  Props = {
    [Enum.NONE]: {key: Enum.NONE, enum: 'NONE', name: 'None'},
    [Enum.CURRENTLY_READING]: {key: Enum.CURRENTLY_READING, enum: 'CURRENTLY_READING', name: 'Currently Reading'},
    [Enum.WANT_TO_READ]: {key: Enum.WANT_TO_READ, enum: 'WANT_TO_READ', name: 'Want to Read'},
    [Enum.READ]: {key: Enum.READ, enum: 'READ', name: 'Read'}
  };

export default {
  ...Enum,

  none: Props[Enum.NONE],
  currentlyReading: Props[Enum.CURRENTLY_READING],
  wantToRead: Props[Enum.WANT_TO_READ],
  read: Props[Enum.READ],

  props: Props,
  asList: Object.values(Props)
};
