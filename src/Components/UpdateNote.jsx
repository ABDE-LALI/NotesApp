import { useEffect, useState } from "react"
import axios from "axios";
export default function UpdateNote(props) {
    const [notetitle, setnotetitle] = useState(props.note.title);
    const [notetext, setnotetext] = useState(props.note.content);
    const [users, setusers] = useState([]);
    const [choosedusers, setchuser] = useState([]);
    const [shusers, setshusers] = useState(false);
    async function getusers() {
        let resp
        try {
            resp = await axios.get("https://notes.devlop.tech/api/users", {
                headers:
                    { Authorization: `Bearer ${props.token}` }
            })
            console.log(resp);
        } catch (error) {
            console.error("pleas try to refresh the page and check you connection!", error.message)
        } finally {
            if (resp && resp.data) {
                setusers(resp.data);
                console.log("choosed", choosedusers);

            }
            else console.error('something went wrong!');
        }
    }
    function putchuser(chuser) {
        let Users = [...users]
        setusers(Users.filter((user) => user.id != chuser.id))
        let chusers = [...choosedusers];
        chusers.push(chuser);
        console.log(chuser);
        setchuser(chusers);
        console.log(choosedusers);

    }
    const remouve = (user) => {
        let Users = [...users];
        Users.splice(user.id - 3, 0, user);
        Users.sort((a, b) => a.id - b.id);
        setusers(Users);
        console.log(users, 're');
        let chusers = [...choosedusers];
        console.log(chusers);
        setchuser(chusers.filter((reuser) => reuser.id != user.id));
        console.log(choosedusers);
        console.log("remouved");

    }
    const showusers = () => setshusers(true);
    const hideusers = () => setshusers(false);
    const save = async () => {
        if (notetitle && notetext) {
            let resp;
            try {
                resp = await axios.put(`https://notes.devlop.tech/api/notes/${props.note.id}`, { "title": notetitle, "content": notetext, 'shared_with': choosedusers.map(user => user.id) }, {
                    headers:
                        { 'Content-Type': 'application/json', Authorization: `Bearer ${props.token}` }
                })
                console.log(resp);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.error(error.message)
                }
            }
            console.log("saved");
            console.log(props.mynonly);
            props.allnots(props.mynonly)
            props.setshow("allnotes");
        }
    }
    const cancel = () => {
        props.setshow("allnotes");
    }
    useEffect(() => {
        getusers(); () => {
            document.removeEventListener("click", hideusers);
        };
    }, [])
    return <>
        <div className="newnote" onClick={() => { shusers && hideusers(false); console.log("hello") }
        }>
            <div className="selectusers" onClick={() => { showusers(); console.log("bliet") }}>
                <span className="sharewith">{choosedusers.length === 0 ? "Share this note" : choosedusers.map((user, index) => <b className="seluser" key={index}>{user.first_name} <span className="remuser" onClick={(event) => { event.stopPropagation(); remouve(user) }}>X</span> </b>)}</span>
                <span className="arrow">▼</span>
                {shusers && <div className="userslist">
                    {shusers ? users.map((user, index) => <div className="user" key={index} onClick={() => { putchuser({ "id": user.id, "first_name": user.first_name, "last_name": user.last_name }) }}>{user.first_name}</div>) : ""}
                </div>}
            </div>
            <input className="typefield" type="text" value={notetitle} onChange={(e) => setnotetitle(e.target.value)} />
            <textarea className="typefield_body" value={notetext} onChange={(e) => setnotetext(e.target.value)} />
            <span>
                <button onClick={cancel}>Cancel</button>
                <button onClick={save}>Save</button>
            </span>
        </div>
    </>
}
