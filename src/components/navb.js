import React from 'react';
import {ethers} from 'ethers';

export default function NavBar(props){
    
    const contentHandler=async()=>{
        // browser asking for metamask connection 
        const accounts=await window.ethereum.request({method:'eth_requestAccounts'});
        const account=ethers.utils.getAddress(accounts[0])
        props.setAccount(account)
         
    }
    return(
        <nav>   
            <div className="nav_brand">
                <h1>DECOM</h1>
            </div>
           {props.account?(<button
            type='button'
            className='nav_connect'>
            {props.account.slice(0,6)+'...'+props.account.slice(38,42)}
            </button>
           ):(<button
            type='button'
            className='nav_connect'
            onClick={contentHandler}>
            connect
            </button>)} 
            <ul className='nav_links'>
                <li><a href='#Clothing & Accessories'>Clothing and Accessories</a></li>
                <li><a href='#Electronics'>Electronics</a></li>
                <li><a href='#Toys and Games'>Toys and Gaming</a></li>
            </ul>

        </nav>
    )
}