import axios from "axios";
import { useState } from "react";
export default function UpdatPass(props) {
    const [oldpass, setoldpass] = useState("");
    const [newpass, setnewpass] = useState("");
    const [connwepass, setconnwepass] = useState("");
    const [ismatch, setnotmatch] = useState(false);
    const [incoOld, setincoold] = useState(false);
    const [badLenght, setbadLenght] = useState(false);
    const updatepassword = async () => {
        if (oldpass.length >= 6 && newpass.length >= 6 && newpass === connwepass) {
            try {
                const resp = await axios.put(`https://notes.devlop.tech/api/update-password`, {
                    "current_password": oldpass,
                    "new_password": newpass,
                    "new_password_confirmation": connwepass
                }, { headers: { Authorization: `Bearer ${props.token}` } })

                props.logout();
            } catch (error) {
                console.log(error.message);
                setincoold(true);
            }
        } else if (newpass.length < 6) {
            setbadLenght(true);
        } else if (newpass !== connwepass) {
            setnotmatch(true);
        }
    }
    return <div className="updatepass">
        <input className="pass" type="text" required value={oldpass} onChange={(e) => { setoldpass(e.target.value), setincoold(false) }} placeholder="enter the old password" />
        <input className="pass" type="text" required value={newpass} onChange={(e) => { setnewpass(e.target.value), setbadLenght(false) }} placeholder="enter a new password" />
        <input className="pass" type="text" required value={connwepass} onChange={(e) => { setconnwepass(e.target.value), setnotmatch(false) }} placeholder="Confirm the new password" />
        <button onClick={() => {
            updatepassword()
        }}>save</button><button onClick={() => { props.setshow("allnotes") }}>Cancel</button>
        {(ismatch || badLenght || incoOld) && <div className="problems">
            {ismatch && <div className="incoinfo">
                The conferamation isnt match the new password!
            </div>}
            {badLenght && <div className="incoinfo">
                The new password must contain 6 characters atleast!
            </div>}
            {incoOld && <div className="incoinfo">
                The old password is not correct!
            </div>}
        </div>}
    </div>
}