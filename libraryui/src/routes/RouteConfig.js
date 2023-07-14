import { RouterLinks } from "../config/AppConfig";
import AddShelf from "../modules/book/AddShelf";
import Books from "../modules/book/Books";
import ShelfDetails from "../modules/book/ShelfDetails";
import AddBook from "../modules/book/booksUnderShelf/AddBook";
import AddBookToLibrary from "../modules/book/booksUnderShelf/AddBookToLibrary";
import ChildShelf from "../modules/book/booksUnderShelf/ChildShelf";
import Borrow from "../modules/borrowBook/Borrow";
import BookList from "../modules/reports/BookList";
import MainReport from "../modules/reports/MainReport";
import AuthorList from "../modules/reports/author/AuthorList";
import Profile from "../modules/user/profile/Profile";

const routes = [
  {
    path: RouterLinks.Profile,
    Component: Profile,
  },
  {
    path: RouterLinks.Books,
    Component: Books,
  },
  {
    path: RouterLinks.AddShelf,
    Component: AddShelf,
  },
  {
    path: RouterLinks.ShelfDetails,
    Component: ShelfDetails,
  },
  {
    path: RouterLinks.ChildShelf,
    Component: ChildShelf,
  },
  {
    path: RouterLinks.AddBook,
    Component: AddBook,
  },
  {
    path: RouterLinks.AddBookToLibrary,
    Component: AddBookToLibrary,
  },
  {
    path: RouterLinks.Report,
    Component: MainReport,
  },
  {
    path: RouterLinks.BookList,
    Component: BookList,
  },
  {
    path: RouterLinks.AuthorList,
    Component: AuthorList,
  },
  {
    path: RouterLinks.BorrowBook,
    Component: Borrow,
  },
];
export default routes;
