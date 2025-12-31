import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from './userSlice';

const SearchBar = React.memo(({ query, handleSearchChange, handleSearch, isSearchVisible }) => {
    return (
        <form className={`d-flex search-form ${isSearchVisible ? 'show' : 'hide'}`} onSubmit={handleSearch}>
            <input
                className="form-control me-2"
                type="search"
                value={query}
                onChange={handleSearchChange}
                placeholder="Search"
                aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">Search</button>
        </form>
    );
});

function Navbar() {
    const dispatch = useDispatch();

    //console.log(user);
    useEffect(() => {
        if (localStorage.getItem("token")); {
            dispatch(fetchUserProfile());
        }
    }, [dispatch]);
    const { user } = useSelector((state) => state.user);
    console.log(user);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearchChange = useCallback((e) => {
        setQuery(e.target.value);
    }, []);

    const handleSearch = useCallback((event) => {
        event.preventDefault();
        const encodedURL = encodeURIComponent(query);
        if (!query) {
            navigate('/');
        } else {
            const currentPath = location.pathname;
            if (currentPath === '/' || currentPath === '/search/markets') {
                navigate(`/search/markets?search=${encodedURL}`);
            } else if (currentPath === '/products' || currentPath === '/myproduct' || currentPath === '/search/products') {
                navigate(`/search/products?search=${encodedURL}`);
            }
        }
    }, [query, location.pathname, navigate]);

    const currentPath = location.pathname;
    const isSearchVisible = currentPath === '/' || currentPath === '/myproduct' || currentPath === '/products' || currentPath === '/search/products' || currentPath === '/search/markets';

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary nav-width">
                <div className="container-fluid">
                    <img src='farmstomarketlogo.png' alt='FarmToMarket' className='img-fluid' />
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                            </li>
                            {user && user.role === 'Buyer' ? (
                                <li className="nav-item">
                                    <Link className="nav-link active" to="/products">Products</Link>
                                </li>
                            ) : user && user.role === 'Farmer' ? (
                                <li className="nav-item">
                                    <Link className="nav-link active" to="/myproduct">My Products</Link>
                                </li>
                            ) : null}
                            {user && user.role === 'ADMIN' && (
                                <li className="nav-item">
                                    <Link className="nav-link active" to="/admin">Admin Panel</Link>
                                </li>
                            )}
                            <li className="nav-item">
                                <Link className="nav-link" to="/contact">Contact</Link>
                            </li>
                        </ul>
                        <SearchBar
                            query={query}
                            handleSearchChange={handleSearchChange}
                            handleSearch={handleSearch}
                            isSearchVisible={isSearchVisible}
                        />
                    </div>
                    {user ? (
                        <div className="nav-profile">
                            <Link className="nav-link" to="/profile">
                                <img className="nav-profile-img" src={user.profileImageURL} alt="Profile" /><br />
                                <span className="nav-profile-msg">{user.fullName}</span>
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <Link className="nav-link" to="/login">
                                <button type="submit" className="btn btn-link">Login</button>
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
}

export default React.memo(Navbar);