import axios from "axios";

export default function AllNotes(props) {
    const remnote = async (noteid) => {
        try {
            const resp = await axios.delete(`https://notes.devlop.tech/api/notes/${noteid}`, {
                headers: { Authorization: `Bearer ${props.token}` },
            });
            props.allnots(props.mynonly);
        } catch (error) {
            console.log(props.mynonly);
            console.error(error.message);
        }
    };

    function Note(note, index) {
        function formatDate(note) {
            const date = new Date(note.date);
            const options = {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            };
            return new Intl.DateTimeFormat("en-US", options).format(date);
        }

        return (
            <div
                onClick={() => {
                    props.updatenote();
                    props.GetUpdatedNoteBody(note);
                }}
                className="note"
                key={index}
            >
                <div className="notedate">{formatDate(note)}</div>
                <div className="noteTile">{note.title}</div>
                <div className="line"></div>
                <div className="noteBody">{note.content}</div>
                <span
                    className="remnot"
                    onClick={(e) => {
                        e.stopPropagation();
                        remnote(note.id);
                        console.log("rem");
                    }}
                >
                    x
                </span>
                <div className="sharedwith">
                    {note.shared_with.length !== 0 &&
                        note.shared_with.map((user, index) => (
                            <span key={index} className="nameshort">
                                <div className="fullname">{user.first_name +" " + user.last_name}</div>
                                {user.first_name[0] + user.last_name[0]}
                            </span>
                        ))}
                </div>
            </div>
        );
    }

    return (
        <>
            {props.nots && (
                <div className="notes">
                    {props.nots.map((note, index) => Note(note, index))}
                </div>
            )}
        </>
    );
}