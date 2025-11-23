import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const checkguest = (Component) => {
  const Wrapper = (props) => {
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    useEffect(() => {
      if (user) {
        navigate('/home', { replace: true });       }
    }, [user, navigate]);

    if (user) return null;

    return <Component {...props} />;
  };

  return Wrapper;
};

export default checkguest;
