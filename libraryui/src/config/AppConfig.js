export const RouterLinks = {
  Login: "/login",
  Profile: "/profile",
  Books: "/",
  AddShelf: "/addShelf",
  ShelfDetails: "/shelfDetails",
  ChildShelf: "/childShelf",
  AddBook: "/addBook",
  AddBookToLibrary: "/addBookToLibrary",
  Report: "/report",
  BookList: "/bookList",
  AuthorList: "/authorList",
  BorrowBook: "/borrow",
  BookReader: "/readBook",
};

export const menuList = [
  {
    menuName: "Home",
    routerLink: "/",
    icon: "fa fa-home",
    visible: true,
  },
  {
    menuName: "Book List",
    routerLink: "/bookList",
    icon: "fa fa-file-lines",
    visible: true,
  },
  {
    menuName: "Author List",
    routerLink: "/authorList",
    icon: "fa-solid fa-user-pen",
    visible: true,
  },
  // {
  //   menuName: "Holdings",
  //   routerLink: "/holdings",
  //   icon: "fa fa-hand-holding-dollar",
  //   visible: true,
  // },
  // {
  //   menuName: "Realised Trade",
  //   routerLink: "/realisedTrade",
  //   icon: "fa-solid fa-money-bill-1-wave",
  //   visible: true,
  // },
  // {
  //   menuName: "Watch List",
  //   routerLink: "/watchList",
  //   icon: "fa fa-clipboard-list",
  //   visible: true,
  // },
  // {
  //   menuName: "Reports",
  //   routerLink: "/reports",
  //   icon: "fa fa-chart-area",
  //   visible: true,
  // },
  // {
  //   menuName: "Screener",
  //   routerLink: "/screener",
  //   icon: "fa fa-search",
  //   visible: true,
  // },
];

export const spinnerConfig = {
  type: "Bars", //Ball-Triangle, Bars, Circles,Grid, Hearts,Oval, Puff, Rings, TailSpin, ThreeDots
  color: "#016bb5",
  height: 50,
  width: 50,
};
