export const findBookIndex = (books, id) => books.findIndex((book) => book.id === id);

export const findBook = (books, id) => {
  const index = findBookIndex(books, id);
  
  if (index < 0)
	return undefined;
  
  return Object.assign({}, books[index])
}

export const sortBooksByTitle = (b1, b2) => {
  if (b1.title < b2.title) return -1;
  if (b1.title > b2.title) return 1;

  return 0;
}