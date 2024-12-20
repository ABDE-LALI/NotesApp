import { useEffect, useState } from "react"
import Login from "./Components/Login"
import Home from "./Components/Home";
export default function App() {
  const [token, settoken] = useState('');
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    settoken(storedToken);
  }, [token]);

  console.log(token);
  console.log("app " + localStorage.getItem("token"));

  return <>
    {token ? <Home token={token} settoken={settoken} /> : <Login settoken={settoken} />}
  </>
}
