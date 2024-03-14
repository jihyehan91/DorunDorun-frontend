import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Myroom (){
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_URL = '';

                const response = await axios.get(API_URL);
                setData(response.data);
            } catch (error) {
                console.error(error);
                throw error;
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2>My room</h2>
            <ul>
                {/* {data.map((item) => {
                    return (
                        <li key={item.id}>
                            <Link to={`/talk/${item.id}`}>
                                <p className="img">
                                    <img src={item.img} alt="" />
                                </p>
                                <strong className="name">{item.name}</strong>
                                <p className="desc truncate-2">{item.desc}</p>
                            </Link>
                        </li>
                    );
                })} */}
            </ul>
        </div>
    );
}
