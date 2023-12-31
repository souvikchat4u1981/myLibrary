import { gql } from "@apollo/client";
export const GET_ALL_PARENT_BOOKSHELFS = gql`
  query GetAllBookShelfs {
    getAllBookShelfs {
      failure
      message
      userId
      bookShelfs {
        parentShelfId
        shelfId
        shelfName
        userId
        shelfImage
      }
    }
  }
`;
export const GET_ALL_PARENT_BOOKSHELFS_WITH_COUNT = gql`
  query GetAllBookShelfsWithCount {
    getAllBookShelfsWithCount {
      failure
      message
      userId
      bookShelfList {
        bookCount
        failure
        message
        userId
        bookShelfs {
          parentShelfId
          shelfId
          shelfImage
          shelfName
          userId
        }
      }
    }
  }
`;

export const ADD_BOOK_SHELF = gql`
  mutation AddBookShelf($bookShelf: BookShelfModelInput) {
    addBookShelf(bookShelf: $bookShelf) {
      failure
      message
      userId
    }
  }
`;

export const GET_CHILD_SHELF = gql`
  query GetChildBookShelfs($parentId: Int) {
    getChildBookShelfs(parentId: $parentId) {
      failure
      message
      userId
      bookShelfs {
        shelfId
        shelfName
        parentShelfId
        userId
        shelfImage
      }
    }
  }
`;

export const GET_CHILD_SHELF_WITH_BOOK_COUNT = gql`
  query GetChildBookShelfsWithCount($parentId: Int) {
    getChildBookShelfsWithCount(parentId: $parentId) {
      failure
      message
      userId
      bookShelfList {
        bookCount
        failure
        message
        userId
        bookShelfs {
          parentShelfId
          shelfId
          shelfImage
          shelfName
          userId
        }
      }
    }
  }
`;

export const GET_ONLINE_BOOKS = gql`
  query RetrieveBooks($queryString: String) {
    retrieveBooks(queryString: $queryString) {
      failure
      message
      userId
      books {
        author
        bookId
        bookName
        bookNameInEnglish
        description
        detailsURL
        failure
        format
        genere
        image
        isbn
        language
        message
        price
        publicastion
        publishigYear
        shelfId
        userId
      }
    }
  }
`;

export const GET_ONLINE_BOOK_DETAILS = gql`
  query BookDetails($book: InitialSearchModelInput) {
    bookDetails(book: $book) {
      author
      bookId
      bookName
      bookNameInEnglish
      description
      detailsURL
      failure
      format
      genere
      image
      isbn
      language
      message
      price
      publicastion
      publishigYear
      shelfId
      userId
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation SaveBook($book: BookModelInput) {
    saveBook(book: $book) {
      failure
      message
      userId
    }
  }
`;

export const LOAD_BOOK_BY_SHELF = gql`
  query LoadBookByShelf($shelfId: Int!) {
    loadBookByShelf(shelfId: $shelfId) {
      failure
      message
      userId
      bookList {
        author
        bookId
        bookName
        bookNameInEnglish
        description
        format
        genere
        image
        isbn
        language
        price
        publicastion
        publishigYear
        purchaseDate
        shelfId
        digitalFileName
      }
    }
  }
`;

export const GET_ALL_SHELF_WITH_RELATION = gql`
  query GetAllShelfWithRelation {
    getAllShelfWithRelation {
      failure
      message
      userId
      shelfRelationModelList {
        parentShelfName
        shelfId
        shelfName
      }
    }
  }
`;

export const GET_SHELF_BY_ID = gql`
  query GetShelfById($id: Int!) {
    getShelfById(id: $id) {
      failure
      message
      userId
      bookShelfs {
        parentShelfId
        shelfId
        shelfImage
        shelfName
        userId
      }
    }
  }
`;

export const TOTAL_BOOKS_COUNT = gql`
  query TotalBookCount {
    totalBookCount
  }
`;

export const FILTER_BOOK_SHELFS = gql`
  query FilterShelfByAuthorOrBook($searchParam: String) {
    filterShelfByAuthorOrBook(searchParam: $searchParam) {
      failure
      message
      userId
      bookShelfList {
        bookCount
        failure
        message
        userId
        bookShelfs {
          parentShelfId
          shelfId
          shelfImage
          shelfName
          userId
        }
      }
    }
  }
`;

export const FILTER_CHILD_BOOK_SHELFS = gql`
  query FilterChildShelfByAuthorOrBook($searchParam: String, $parentId: Int!) {
    filterChildShelfByAuthorOrBook(
      searchParam: $searchParam
      parentId: $parentId
    ) {
      failure
      message
      userId
      bookShelfList {
        bookCount
        failure
        message
        userId
        bookShelfs {
          parentShelfId
          shelfId
          shelfImage
          shelfName
          userId
        }
      }
    }
  }
`;

export const FILTER_BOOK_BY_PARENT_SHELF = gql`
  query LoadBookByParentShelfAndFilter($shelfId: Int!, $filterParam: String) {
    loadBookByParentShelfAndFilter(
      shelfId: $shelfId
      filterParam: $filterParam
    ) {
      failure
      message
      userId
      bookList {
        author
        bookId
        bookName
        description
        format
        genere
        image
        isbn
        language
        price
        publicastion
        publishigYear
        purchaseDate
        shelfId
      }
    }
  }
`;

export const FILTER_BOOK_BY_SHELF = gql`
  query LoadBookByShelfAndFilter($shelfId: Int!, $filterParam: String) {
    loadBookByShelfAndFilter(shelfId: $shelfId, filterParam: $filterParam) {
      failure
      message
      userId
      bookList {
        author
        bookId
        bookName
        bookNameInEnglish
        description
        format
        genere
        image
        isbn
        language
        price
        publicastion
        publishigYear
        purchaseDate
        shelfId
        digitalFileName
      }
    }
  }
`;

export const GET_AUTOCOMPLETE_VALUES = gql`
  query GetUniqueListByColumn($columnName: String) {
    getUniqueListByColumn(columnName: $columnName)
  }
`;

export const GET_ALL_BOOKS = gql`
  query GetAllBooksWithAuthorAndShelf {
    getAllBooksWithAuthorAndShelf {
      failure
      message
      userId
      bookList {
        author
        bookId
        bookName
        bookNameInEnglish
        description
        format
        language
        parentShelfName
        publication
        shelfId
        shelfName
        bookImage
        shelfImage
        digitalFileName
      }
    }
  }
`;

export const GET_ALL_AUTHORS = gql`
  query GetAllAuthor {
    getAllAuthor {
      authorWithBookCountModels {
        authorImage
        authorName
        bookCount
      }
      failure
      message
    }
  }
`;

export const GET_ALL_BOOKS_BY_AUTHOR = gql`
  query GetAllBooksWithAuthorAndShelfByAuthor($author: String) {
    getAllBooksWithAuthorAndShelfByAuthor(author: $author) {
      failure
      message
      userId
      bookList {
        author
        bookId
        bookName
        bookNameInEnglish
        description
        format
        language
        parentShelfName
        publication
        shelfId
        shelfName
        bookImage
        shelfImage
        digitalFileName
        isbn
        publishing_year
        price
      }
    }
  }
`;

export const GET_FIRST_BOOK_BY_SHELF = gql`
  query GetFirstBookInShelf($shelfId: Int!) {
    getFirstBookInShelf(shelfId: $shelfId) {
      failure
      message
      userId
      book {
        author
        bookId
        bookName
        bookNameInEnglish
        description
        format
        genere
        image
        isbn
        language
        price
        publicastion
        publishigYear
        purchaseDate
        shelfId
      }
    }
  }
`;

export const GET_FIRST_BOOK_BY_AUTHOR = gql`
  query GetFirstBookInAuthor($author: String) {
    getFirstBookInAuthor(author: $author) {
      failure
      message
      userId
      book {
        author
        bookId
        bookName
        bookNameInEnglish
        description
        format
        genere
        image
        isbn
        language
        price
        publicastion
        publishigYear
        purchaseDate
        shelfId
      }
    }
  }
`;

export const DELETE_SHELF = gql`
  mutation DeleteShelfs($shelf: Int!) {
    deleteShelfs(shelf: $shelf) {
      failure
      message
      userId
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($bookId: Int!) {
    deleteBook(bookId: $bookId) {
      failure
      message
      userId
    }
  }
`;

export const BORROW_BOOK = gql`
  mutation AddBookToBorrow($borrowBook: BorrowModelInput) {
    addBookToBorrow(borrowBook: $borrowBook) {
      failure
      message
      userId
    }
  }
`;

export const GET_BORROW_DETAILS = gql`
  query BookBorrowedBy($bookId: Int!) {
    bookBorrowedBy(bookId: $bookId) {
      failure
      message
      userId
      borrow {
        bookId
        borrowBy
        borrowDate
        borrowId
        comment
        isReturn
        returnDate
      }
    }
  }
`;

export const GET_BORROW_LIST = gql`
  query GetBorrowList {
    getBorrowList {
      failure
      message
      userId
      borrowList {
        bookId
        bookName
        bookNameInEnglish
        borrowBy
        borrowDate
        borrowId
        parentShelfName
        shelfName
        bookImage
      }
    }
  }
`;
