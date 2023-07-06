import { RouterLinks } from "../config/AppConfig";
import AddShelf from "../modules/book/AddShelf";
import Books from "../modules/book/Books";
import ShelfDetails from "../modules/book/ShelfDetails";
import AddBook from "../modules/book/booksUnderShelf/AddBook";
import ChildShelf from "../modules/book/booksUnderShelf/ChildShelf";
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
];
export default routes;
