import { useState } from "react"
import axios from "axios";
export default function Login(props) {

    const [usern, setusern] = useState("");
    const [pass, setpass] = useState("");
    const [emptp, setemptp] = useState(false);
    const [emptu, setemptu] = useState(false);
    const [incoinfo, setincoinfo] = useState(false);
    const [tokpro, settokpro] = useState(false);
    function enterusern(value) {
        setusern(value.target.value);
    }
    function enterpass(value) {
        setpass(value.target.value)
    }
    async function login() {
        if (usern && pass) {
            let resp;
            try {
                resp = await axios.post(`https://notes.devlop.tech/api/login`, { "cin": usern, "password": pass })
                console.log(resp);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.error('the entrend username or the password is incorrect!')
                    setincoinfo(true);
                } else {
                    console.error("uneccpected error:", error.message);

                }
            } finally {
                if (resp && resp.data.token) {
                    localStorage.setItem("token", resp.data.token);
                    localStorage.setItem("user", resp.data.user.first_name);
                    props.settoken(localStorage.getItem("token"))
                } else if (incoinfo) {
                    console.error("the token is not funded, please try later!");
                    settokpro(true);
                }
            }
        } else {
            !pass && setemptp(true);
            !usern && setemptu(true);
        }
    }
    return (
        <div id="root">
            <div className="login">
                <div className="name">
                    Welcome👋
                    <div className="guid">Sign in to your account</div>
                </div>
                <input
                    required
                    type="text"
                    value={usern}
                    onChange={(val) => {
                        enterusern(val), setemptu(false);
                    }}
                    placeholder="Enter your username"
                />
                <div className="required">{emptu && "*This field is required"}</div>
                <input
                    required
                    type="password"
                    value={pass}
                    onChange={(val) => {
                        enterpass(val), setemptp(false);
                    }}
                    placeholder="Enter your password"
                />
                <div className="required">{emptp && "*This field is required"}</div>
                <button onClick={login}>Login</button>
                {(incoinfo||tokpro) && <div className="problems">
                    {incoinfo && (
                        <div className="incoinfo">
                            The entered password or username is incorrect!
                        </div>
                    )}
                    {(tokpro&&!incoinfo) && (
                        <div className="tokpro">
                            We encountered problems. Please try again later!
                        </div>
                    )}
                </div>}
            </div>
        </div>
    );
}