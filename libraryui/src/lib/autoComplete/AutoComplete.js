import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { data } from "./sample";
import "./autocomplete.scss";
import { getCall } from "../../utils/RestCalls";

const AutoComplete = (props) => {
  const [activeOption, setActiveOption] = useState(0);
  const [value, setValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [filteredOptions, setFilteredOption] = useState([]);
  const [optionList, setOptionList] = useState(null);

  const onInputChange = (e) => {
    let val = e.target.value;
    if (props.upperCase) {
      val = val.toUpperCase();
    }
    let d = { ...props };
    if (d.type === "number") {
      if (!props.blankAllowed) {
        if (!val.includes(".")) {
          e.target.value = Number(val);
        } else {
          // e.target.value = e.target.value;
        }
      } else {
        if (val !== "") {
          e.target.value = val;
        }
      }
    }
    d.value = val;
    setValue(val);

    props.events.onChange(d);
    if (val !== "") {
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      console.log(value);
      if (value !== "") {
        setActiveOption(0);
        getStockList(value);
      }
      // Send Axios request here
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [value]);

  const getStockList = (val) => {
    let url = "tradingview/search-stock/?stockName=" + val;

    getCall({
      endpoint: url,
    }).then((data) => {
      //console.log(data);
      if (!data.failure) {
        generateOptionList(data.list);
        setFilteredOption(data.list);
      }
    });
  };

  const onClick = (e) => {
    setActiveOption(0);
    setFilteredOption([]);
    setShowOptions(false);
    let d = { ...props };
    d.value = e.currentTarget.innerText.substr(
      0,
      e.currentTarget.innerText.indexOf("--") - 1
    );
    props.events.onChange(d);
  };

  const onKeyDown = (e) => {
    console.log(e.keyCode);
    let showOption = true;
    setShowOptions(true);
    if (e.keyCode === 13) {
      setActiveOption(0);
      setFilteredOption([]);
      setShowOptions(false);
      let d = { ...props };
      let item = filteredOptions[activeOption].symbol;
      d.value = item;
      props.events.onChange(d);
      //   showOption = false;
      //   let item = filteredOptions[activeOption].symbol
      //     .replace("<em>", "")
      //     .replace("</em>", "");
      //   let d = { ...props };
      //   d.value = item;
      //   setValue(item);
      //   getStockList(item);
      //   setActiveOption(0);
      //   setFilteredOption([]);
      //   setShowOptions(false);

      //   props.events.onChange(d);
      //   console.log(item);
    } else if (e.keyCode === 38) {
      if (activeOption === 0) {
        return;
      }
      setActiveOption(activeOption - 1);
    } else if (e.keyCode === 40) {
      if (activeOption === filteredOptions.length - 1) {
        console.log(activeOption);
        return;
      }
      setActiveOption(activeOption + 1);
    }
  };

  const generateOptionList = (data) => {
    let optionList;
    if (data.length) {
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
    // setOptionList(optionList);
  };

  return (
    <div>
      <label className={props.labelClass} style={{ paddingBottom: "0px" }}>
        {props.label} {props.required && <span className="text-danger">*</span>}
      </label>
      <input
        id={props.id}
        name={props.name}
        value={props.value}
        onChange={onInputChange}
        type={props.type}
        placeholder={props.placeholder}
        className={props.className}
        disabled={props.disabled}
        onKeyDown={onKeyDown}
      />
      {showOptions && filteredOptions && filteredOptions.length && (
        <ul className="options">
          {filteredOptions.map((optionName, index) => {
            let className;
            if (index === activeOption) {
              className = "option-active";
            }
            return (
              <li
                className={className}
                key={optionName.symbol + optionName.description}
                onClick={onClick}
              >
                {optionName.symbol.replace("<em>", "").replace("</em>", "") +
                  "  --  " +
                  optionName.description
                    .replace("<em>", "")
                    .replace("</em>", "")}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

AutoComplete.propTypes = {};

export default AutoComplete;
