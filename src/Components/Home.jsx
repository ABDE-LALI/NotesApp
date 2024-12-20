import axios from "axios";
import { useEffect, useState } from "react";
import NewNote from "./newNote";
import AllNotes from "./AllNotes";
import UpdateNote from "./updatenote";
import UpdatPass from "./updatepass";
import ReactSwitch from 'react-switch';

export default function Home(props) {
    console.log("login " + localStorage.getItem('token'));
    const [show, setshow] = useState("allnotes");
    const [nots, setallnots] = useState([]);
    const [updatednotebody, setupdatenotebody] = useState(null);
    const [mynotsonly, setmynonly] = useState(false);

    useEffect(() => { allnots(mynotsonly); }, [mynotsonly]);
    useEffect(() => { showmynotes() }, []);


    const showmynotes = () => {
        mynotsonly ? setmynonly(true) : setmynonly(false);
        console.log(mynotsonly);
        allnots(mynotsonly);
    };

    async function allnots(mynonly) {
        let resp;
        try {
            resp = await axios.get("https://notes.devlop.tech/api/notes", {
                headers: { Authorization: `Bearer ${props.token}` }
            });
            console.log(resp);
        } catch (error) {
            logout();
            props.settoken(false);
            console.error("Please try to refresh the page and check your connection!", error.message);
        } finally {
            if (resp && resp.data) {
                setallnots(resp ? () => { return mynonly ? resp.data.filter((note) => note.is_owner) : resp.data } : 'Something went wrong!');
            }
        }
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        props.settoken('');
    }

    const handleToggle = (nextChecked) => {
        setmynonly(nextChecked);
        allnots(nextChecked);
    };
    const showContent = () => {
        switch (show) {
            case "allnotes":
                return <AllNotes
                    GetUpdatedNoteBody={setupdatenotebody}
                    updatenote={() => { setshow("updatenote") }}
                    mynonly={mynotsonly}
                    setnots={setallnots}
                    allnots={allnots}
                    nots={nots}
                    token={props.token}
                />
            case "newnote":
                return <NewNote setshow={setshow} mynonly={mynotsonly} nots={nots} allnots={allnots} token={props.token} />
            case "updatenote":
                return <UpdateNote setshow={setshow} note={updatednotebody} mynonly={mynotsonly} nots={nots} allnots={allnots} token={props.token} />
            case "updatepass":
                return <UpdatPass setshow={setshow} logout={logout} token={props.token} />
            default:
                return <H1>not found</H1>
        }
    }

    return (
        <div className="home">
            <div className="actions">
                <div className="greenots">
                    <div className="greetings">Hello {localStorage.getItem("user")}👋</div>
                    <div className="showmynotes">
                        <ReactSwitch
                            checked={mynotsonly}
                            onChange={handleToggle}
                            offColor="#888"
                            onColor="#4CAF50"
                            offHandleColor="#fff"
                            onHandleColor="#fff"
                            height={24}
                            width={48}
                        />
                        <span>My Notes Only</span>
                    </div>
                </div>
                <button onClick={logout}>Logout</button>
                <button onClick={() => { setshow("newnote") }}>New Note</button>
                <button onClick={() => { setshow("updatepass") }}>Update Password</button>
            </div>
            {

                showContent()}
        </div>
    );
}
