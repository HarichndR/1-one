import React from 'react';
import Navbar from './Navbar';

function Layout({ children }) {
    const labale={lebel:"product", }
    return (
        <div>
            <Navbar label={labale.lebel}/>
            {children}
            
        </div>
    );
}

export default Layout;