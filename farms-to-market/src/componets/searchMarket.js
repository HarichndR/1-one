// MarketPage.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
const url = process.env.BACKEND_URL;
const MarketPage = () => {
    const [data, setData] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const fetchMarkets = async () => {
            const params = new URLSearchParams(location.search);
            const searchQuery = params.get('search')?.toLowerCase() || '';
            const response = await fetch(`${url}/product/markets?search=${searchQuery}`);
            const data = await response.json();
            setData(data);
        };

        fetchMarkets();
    }, [location.search]);

    return (
        <div className="container mt-6">
            <div className="row">
                <div className="table-responsive" style={{ height: '800px', overflowY: 'auto' }}>
                    <table className="table table-bordered table-striped">
                        <thead className="thead-dark">
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
                                    <td>{index}</td>
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

export default MarketPage;
