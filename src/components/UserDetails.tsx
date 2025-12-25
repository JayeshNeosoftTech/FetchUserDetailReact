import "../assets/css/userdetails.css";
import { useState, useEffect } from "react";
import axios from "axios";

interface User{
    username: string;
    email: string;
    imgsrc: string;
}
const UserDetails = () =>{


    const [userDetail, setUserDetail] = useState<User | null>(null);
    const[loading, setLoading]= useState<boolean>(false);
    const[error, setError]= useState<string | null>(null);

    const loadUser = async () => {
    setLoading(true);
    setError(null);

        try {
        const response = await axios.get("https://randomuser.me/api");

        const imgsrc = response.data.results[0].picture.large;
        const username = `${response.data.results[0].name.title}. ${response.data.results[0].name.first} ${response.data.results[0].name.last}`;
        const email = response.data.results[0].email;

        const userData: User = { username, email, imgsrc };

        setUserDetail(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        } catch (err) {
        setError("Failed to load user");
        } finally {
        setLoading(false);
        }
    };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUserDetail(JSON.parse(savedUser));
    } else {
      loadUser();
    }
  }, []);

  if (loading) return <p className="msgTxt loaderTxt">Loading...</p>;
  if (error) return <p className="msgTxt text-danger">{error}</p>;
  if (!userDetail) return <p className="msgTxt">No user data</p>;

  const { username, email, imgsrc } = userDetail;

    return(
        <div>
            <div className="user-card">
                <img src={imgsrc} alt="Profile" />

                <div className="user-detail">
                    <p className="user-name">{username}</p>
                    <a className="user-email" href={`mailto:${email}`}>{email}</a>
                </div>
            </div>

            <button className="refresh-btn" type="submit" onClick={loadUser}>Refresh</button>
        </div>
    );
}

export default UserDetails;