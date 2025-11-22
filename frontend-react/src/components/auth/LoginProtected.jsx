import Login from "../pages/login";
import checkguest from "./checkguest";


const LoginProtected = checkguest(Login);
export default LoginProtected;