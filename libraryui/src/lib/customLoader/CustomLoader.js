import { spinnerConfig } from "../../config/AppConfig";
import { Spinner } from "./spinner/Spinner";

const CustomLoader = (props) => {
  return <Spinner spinnerConfig={spinnerConfig} />;
};
export default CustomLoader;
