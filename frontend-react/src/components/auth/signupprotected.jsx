import Signup from "../pages/signup";
import checkguest from "./checkguest";


const Signupprotected = checkguest(Signup);
export default Signupprotected;