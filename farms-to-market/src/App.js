import React from 'react';
import { BrowserRouter as Router, Route,  Routes , useLocation } from 'react-router-dom';
import Home from './componets/Home';
import Contact from './componets/Contact'; // Make sure to create thiselement
import MYproduct from './componets/MYproduct'; // Make sure to create this 
import RegistrationForm from './componets/RegistrationForm';
import Layout from './componets/layout';
import Login from './componets/Login';
import UserProfile from './componets/profile';
import Logout from './componets/logout';
import AddNewProduct from './componets/add-product';
import Products from './componets/products';
import Cart from './componets/cart';
import Chat from './componets/ChatPage';
import MarketPage from './componets/searchMarket';
import ProductPage from './componets/searchproduct';
function App() {
    
    return (
        <>
        <Router>
         <Layout>   
        <Routes>
                <Route exact path='/' element={<Home/>}/>*
                <Route path='/add-product' element={<AddNewProduct/>}/>
                <Route path='/cart' element={<Cart/>}/>
                <Route path='/chat/recipientId' element={<Chat/>}/>
                <Route  path="/Contact"element={<Contact/>} />
                <Route  path="/myproduct"element={<MYproduct/>} />
                <Route path='/login'element={<Login/>}/>
                <Route path='/register' element={<RegistrationForm/>}/>
                <Route path='/profile'element={<UserProfile/>}/>
                <Route path='/logout' element={<Logout/>}/>
                <Route path='/products' element={<Products/>}/>
                <Route path='/search/markets' element={<MarketPage/>} />
                <Route path="/search/products" element={<ProductPage/>} />
                {/*<Route exact path='./products'element={<products/>}/>*/}
                {/* This should match the href prop */}
                {/* Add more routes as needed */}
            
        
        </Routes>
        </Layout>
        </Router>
        
        </>
    );
}

export default App;
