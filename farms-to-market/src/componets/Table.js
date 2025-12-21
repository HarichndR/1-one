import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
const url = process.env.Backend_URL;
function Table() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        axios.get(`http://localhost:8001/product/all-product`)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError(error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        let scrollAmount = 0;
        const scrollSpeed = 1; // Adjust the scroll speed as needed
        const scrollInterval = 20; // Time in milliseconds between each scroll step

        if (scrollContainer) {
            const scrollStep = () => {
                scrollAmount += scrollSpeed;
                if (scrollAmount >= scrollContainer.scrollHeight - scrollContainer.clientHeight) {
                    scrollAmount = 0;
                }
                scrollContainer.scroll = scrollAmount;
            };
            const intervalId = setInterval(scrollStep, scrollInterval);

            return () => clearInterval(intervalId); // Cleanup on unmount
        }
    }, [data]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!data || data.length === 0) {
        return <div>No data available.</div>;
    }

    return (
        <div className="container mt-0">
            <div className="row">
                <div className="table-responsive top-0" style={{ height:'700px', overflowY: 'auto' , width:'100%'}} ref={scrollContainerRef}>
                    <table className="table table-bordered table-striped " >
                        <thead className="thead-dark sticky-top-10 bg-white p-0 shadow-md">
                            <tr>
                                <th>Index</th>
                                <th>Name</th>
                                <th>Mandi</th>
                                <th>Date</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td className='font-bold'>{index}</td>
                                    <td>{item.name}</td>
                                    <td>{item.mandi.city}, {item.mandi.state}, {item.mandi.country}</td>
                                    <td>{item.date}</td>
                                    <td>{item.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Table;
