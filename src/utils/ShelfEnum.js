const Enum = {
    NONE: 0,
    CURRENTLY_READING: 1,
    WANT_TO_READ: 2,
    READ: 3
  },

  EnumStr = {
    'none': Enum.NONE,
    'currentlyReading': Enum.CURRENTLY_READING,
    'wantToRead': Enum.WANT_TO_READ,
    'read': Enum.READ
  },

  Props = {
    [Enum.NONE]: {
      id: Enum.NONE,
      enum: 'NONE',
      name: 'None'
    },
    [Enum.CURRENTLY_READING]: {
      id: Enum.CURRENTLY_READING,
      enum: 'CURRENTLY_READING',
      name: 'Currently Reading'
    },
    [Enum.WANT_TO_READ]: {
      id: Enum.WANT_TO_READ,
      enum: 'WANT_TO_READ',
      name: 'Want to Read'
    },
    [Enum.READ]: {
      id: Enum.READ,
      enum: 'READ',
      name: 'Read'
    }
  };

const ShelfEnum = {
  ...Enum,

  Id: function(enumStr) {
    return EnumStr[enumStr] || Enum.NONE;
  },

  none: Props[Enum.NONE],
  currentlyReading: Props[Enum.CURRENTLY_READING],
  wantToRead: Props[Enum.WANT_TO_READ],
  read: Props[Enum.READ],

  props: Props,
  asList: Object.values(Props)
};

export const shelves = () => {
  const { none, currentlyReading, wantToRead, read } = ShelfEnum,
    items = [
      {id: '', value: '', name: 'Move to..', disabled: true},
      {id: currentlyReading.id, value: currentlyReading.id, name: currentlyReading.name},
      {id: wantToRead.id, value: wantToRead.id, name: wantToRead.name},
      {id: read.id, value: read.id, name: read.name},
      {id: none.id, value: none.id, name: none.name},
    ];

  return items;
}

export default ShelfEnum;
