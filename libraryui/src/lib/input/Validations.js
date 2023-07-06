const validations = {
  required: {
    rule: () => /\S/,
    formatter(fieldName) {
      return `${fieldName} is required.`;
    },
  },
  numeric: {
    rule: () => /^\d+$/,
    formatter(fieldName) {
      return `${fieldName} should contain only positive numbers.`;
    },
  },
  dropdownWithNumericID: {
    rule: () => /^[1-9][0-9]*$/,
    formatter(fieldName) {
      return `Please select ${fieldName} `;
    },
  },
  validateemail: {
    rule: () =>
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    formatter() {
      return `should be a email`;
    },
  },
  passwordRule: {
    rule: () =>
      /^(?=(?:.*[A-Z]){1,})(?=(?:.*[a-z]){1,})(?=(?:.*\d){1,})(?=(?:.*[!@#$%^&*()\\-_=+{};:,<.>|/?"']){1,})(?!.*(.)\1{2})([A-Za-z0-9!@#$%^&*()\\-_=+{};:,<.>|/?"']{8,15})$/,
    formatter() {
      return `Password rule not matched`;
    },
  },
  validatemobile: {
    rule: () => /^(\+\d{1,3}[- ]?)?\d{10}$/,
    formatter() {
      return "Not a valid mobile number";
    },
  },
};

export default validations;
