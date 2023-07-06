import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import validations from "./Validations";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import "react-calendar/dist/Calendar.css";
import "./input.scss";
const Input = (props) => {
  const {
    contClass,
    fieldClass,
    errorClass,
    validationErrorClass,
    labelClass,
  } = props.classes;
  const [error, setError] = useState(null);
  const maxNumber = 999999999999.99;

  useEffect(() => {
    if (props.type.toLowerCase() === "date") {
      props.value !== "" && typeof props.value !== "undefined"
        ? setStartDate(new Date(props.value))
        : setStartDate(new Date());
    }
  }, [props]);

  const validateField = (fieldValue) => {
    const rules = props.validate ? props.validate.split("|") : "";
    if (rules.length) {
      for (const rule in rules) {
        let err = "";
        const ruleName = rules[rule];
        const validation = validations[ruleName] || props.customRules[ruleName];
        const isRuleSatisfied = validation.rule().test(fieldValue.toString());
        if (!isRuleSatisfied) {
          err = validation.formatter.apply(null, [props.label || props.id]);
          setError(err);
        } else {
          err = "";
          setError("");
        }
        if (err !== "") {
          break;
        }
      }
    }
  };

  const checkBoxLabel = () => {
    if (props.type === "checkbox" || props.type === "radio") {
      return (
        <label
          className="form-label ms-1"
          style={{ marginTop: "0px", verticalAlign: "middle" }}
        >
          {props.label}
        </label>
      );
    }
  };
  const [startDate, setStartDate] = useState(new Date());

  const onDateChange = (date) => {
    //console.log(date);
    setStartDate(date);
    let d = { ...props };
    d.value = date;
    validateField(date);
    props.events.onChange(d);
  };

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
    validateField(val);
    if (d.type === "number") {
      let max = d.max ? d.max : maxNumber;
      if (val > max) {
        val = max;
        d.value = max;
      }
    }

    props.events.onChange(d);
  };

  return props.value !== undefined ? (
    <div className={contClass}>
      {props.type !== "checkbox" && props.type !== "radio" && props.label && (
        <label className={labelClass} style={{ paddingBottom: "0px" }}>
          {props.label}{" "}
          {props.required && <span className="text-danger">*</span>}
        </label>
      )}
      {props.type === "dropdown" ? (
        props.inputType === "inputgroup" ? (
          <div>
            <div className="input-group mb-3">
              <span className="input-group-text text-addon" id="basic-addon2">
                {props.icon}
              </span>
              <select
                id={props.id}
                name={props.name}
                value={props.value}
                onChange={onInputChange}
                className={`${fieldClass} ${validationErrorClass} group-box`}
                disabled={props.disabled}
              >
                {props.children}
              </select>
            </div>
          </div>
        ) : (
          <select
            id={props.id}
            name={props.name}
            value={props.value}
            onChange={onInputChange}
            className={`${fieldClass} ${validationErrorClass} `}
            disabled={props.disabled}
          >
            {props.children}
          </select>
        )
      ) : props.type === "textarea" ? (
        <textarea
          id={props.id}
          name={props.name}
          value={props.value}
          onChange={onInputChange}
          className={`${fieldClass} ${validationErrorClass}`}
          disabled={props.disabled}
          rows={props.rows}
          cols={props.cols}
          maxlength={props.maxlength}
        />
      ) : props.type.toLowerCase() === "date" ? (
        <div>
          <DatePicker
            selected={startDate}
            showIcon
            onChange={(date) => onDateChange(date)}
            dateFormat={props.dateFormat ? props.dateFormat : "dd/MM/yyyy"}
            className={`${fieldClass} ${validationErrorClass}`}
            disabled={props.disabled}
          />
        </div>
      ) : props.inputType.toLowerCase() === "inputgroup" ? (
        <div>
          <div className="input-group mb-3">
            <span className="input-group-text text-addon" id="basic-addon2">
              {props.icon}
            </span>
            <input
              id={props.id}
              name={props.name}
              value={
                props.type === "number"
                  ? props.blankAllowed
                    ? props.value === 0
                      ? ""
                      : props.value
                    : +props.value
                  : props.value
              }
              onChange={onInputChange}
              type={props.type}
              placeholder={props.placeholder}
              className={`${fieldClass} ${validationErrorClass} group-box`}
              disabled={props.disabled}
              checked={props.checked ? props.checked : false}
              min={props.min}
              max={
                props.max ? props.max : props.type === "number" ? maxNumber : ""
              }
              step={props.step}
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
            />
          </div>
        </div>
      ) : (
        <div>
          <input
            id={props.id}
            name={props.name}
            value={
              props.type === "number"
                ? props.blankAllowed
                  ? props.value === 0
                    ? ""
                    : props.value
                  : +props.value
                : props.value
            }
            onChange={onInputChange}
            type={props.type}
            placeholder={props.placeholder}
            className={`${fieldClass} ${validationErrorClass}`}
            disabled={props.disabled}
            checked={props.checked ? props.checked : false}
            min={props.min}
            max={
              props.max ? props.max : props.type === "number" ? maxNumber : ""
            }
            step={props.step}
          />
          {checkBoxLabel()}
        </div>
      )}

      <span className={errorClass}>{error}</span>
    </div>
  ) : (
    ""
  );
};

Input.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  rows: PropTypes.number,
  cols: PropTypes.number,
  value: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  validate: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  inputType: PropTypes.string,
  required: PropTypes.bool,
  events: PropTypes.object,
  classes: PropTypes.object,
  onChange: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
};

Input.defaultProps = {
  label: "",
  type: "text",
  min: 0,
  inputType: "text",
  step: 0.01,
};

export default Input;
