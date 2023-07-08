import { Fragment } from "react";

const Select = (props) => {
  return (
    <Fragment>
      <label className="form-label" htmlFor={props.inputName}>
        {props.inputLabel}{" "}
        {props.required && <span className="asterix">*</span>}
      </label>
      {props.withValidation && (
        <select
          className={`form-select form-select-xs ${
            props.inputsValid[props.id] === "invalid"
              ? "is-invalid"
              : props.inputsValid[props.id] === "valid"
              ? "is-valid"
              : ""
          }`}
          id={props.id}
          value={props.value}
          onChange={(e) => props.onChange(e, props.id)}
        >
          {props.initialOption && (
            <option value={props.initialOption.value}>
              {props.initialOption.displayText}
            </option>
          )}
          {props.options.map((m, index) => {
            return (
              <option key={index} value={m.value}>
                {m.displayText}
              </option>
            );
          })}
        </select>
      )}
      {!props.withValidation && (
        <select
          className={`form-select form-select-xs `}
          id={props.id}
          value={props.value}
          onChange={(e) => props.onChange(e, props.id)}
        >
          {props.initialOption && (
            <option value={props.initialOption.value}>
              {props.initialOption.displayText}
            </option>
          )}
          {props.options.map((m, index) => {
            return (
              <option key={index} value={m.value}>
                {m.displayText}
              </option>
            );
          })}
        </select>
      )}

      {props.error && (
        <div className="invalid-feedback mt-2">{props.error[props.id]}</div>
      )}
    </Fragment>
  );
};
export default Select;
