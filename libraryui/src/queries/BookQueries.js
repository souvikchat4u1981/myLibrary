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
