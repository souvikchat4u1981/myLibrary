import React, { Fragment, useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_BOOK_SHELF,
  GET_ALL_PARENT_BOOKSHELFS,
} from "../../queries/BookQueries";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../../lib/input/Input";
import formReducer from "../../lib/formReducer/FormReducer";
import Button from "../../lib/button/Button";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../lib/toastMessage/Toastmessage";
import CustomLoader from "../../lib/customLoader/CustomLoader";

const AddShelf = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [parentShelfs, setParentShelfs] = useState(null);
  const initShelf = {
    parentShelfId: "0",
    shelfId: 0,
    shelfName: "",
    userId: null,
  };

  useEffect(() => {
    if (location.state == null) {
      let d = initShelf;
      newShelfDispatch({
        type: "SET INITIAL VALUE",

        payload: d,
      });
      setShelf(d);
    } else {
      let shelf = initShelf;
      let existingData = location.state.shelf;
      shelf.shelfId = existingData.shelfId;
      shelf.shelfName = existingData.shelfName;
      shelf.parentShelfId = existingData.parentShelfId
        ? existingData.parentShelfId
        : 0;
      let d = shelf;
      newShelfDispatch({
        type: "SET INITIAL VALUE",

        payload: d,
      });
      setShelf(d);
    }
  }, []);

  const [shelf, setShelf] = useState(initShelf);

  const { refetch } = useQuery(GET_ALL_PARENT_BOOKSHELFS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (!data.getAllBookShelfs.failure) {
        setParentShelfs(data.getAllBookShelfs.bookShelfs);
      }
    },

    onError: (data) => {
      console.log(data);
    },
  });

  const [addBookShelf] = useMutation(ADD_BOOK_SHELF, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (!data.addBookShelf.failure) {
        newShelfDispatch({
          type: "SET INITIAL VALUE",
          payload: initShelf,
        });
        setShelf(initShelf);
        SuccessMessage("Shelf added successfully");
      } else {
        ErrorMessage(data.addBookShelf.message);
      }
      setLoad(false);
    },

    onError: (data) => {
      console.log(data);
      setLoad(false);
    },
  });

  const onInputChange = (data) => {
    let d = shelf;
    d[data.id] = data.value;

    newShelfDispatch({
      type: "HANDLE INPUT TEXT",
      field: data.id,

      payload: data.value,
    });
  };

  let [newShelf, newShelfDispatch] = useReducer(formReducer, initShelf);

  const onSaveClick = (e) => {
    e.preventDefault();
    console.log(shelf);
    if (shelf.shelfName !== "") {
      setLoad(true);
      addBookShelf({ variables: { bookShelf: { bookShelfs: shelf } } });
    }
  };

  const [load, setLoad] = useState(false);

  return (
    <Fragment>
      {load && <CustomLoader />}
      <div className="p-2 pt-3 row">
        <i
          className="fa fa-circle-left fa-2x hand golden-text"
          onClick={() => navigate(-1)}
          title="go back"
        ></i>
      </div>
      <div className="p-2 row">
        <div className="col-sm-4"></div>
        <div className="col-sm-4 form-border shadow">
          <form>
            <div className="row">
              <Input
                id="parentShelfId"
                label="Parent Shelf"
                type="dropdown"
                value={newShelf.parentShelfId}
                events={{ onChange: (data) => onInputChange(data) }}
                classes={{
                  errorClass: "error-label",
                  fieldClass: "form-select form-select-sm",
                }}
              >
                <option value={"0"}>
                  Select shelf only if you want to add as child
                </option>

                {parentShelfs &&
                  parentShelfs.map((m) => {
                    return (
                      <option key={m.shelfId} value={m.shelfId}>
                        {m.shelfName}
                      </option>
                    );
                  })}
              </Input>
            </div>
            <div className="row mt-2">
              <Input
                id="shelfName"
                value={newShelf.shelfName}
                inputType="text"
                placeholder={"Shelf Name"}
                label="Shelf Name"
                icon={<i className="fa fa-user-circle"></i>}
                events={{ onChange: (data) => onInputChange(data) }}
                classes={{
                  contClass: "",
                  errorClass: "error-label",
                  fieldClass: "form-control form-control-sm",
                  labelClass: "large-text-header",
                }}
              />
            </div>
            <div className="row mt-2 p-2">
              <Button type="submit" onClick={onSaveClick}>
                {location.state ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

AddShelf.propTypes = {};

export default AddShelf;
