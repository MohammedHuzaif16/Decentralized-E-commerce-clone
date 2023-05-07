import { useEffect,useState } from 'react';
import React from 'react';
import {ethers} from 'ethers'
import './App.css';
import NavBar from './components/navb';
import Section from './components/section';
import Product from './components/products';
import Rating from './components/rating';

//importing abis
import Block2 from './abis/Block2.json';
import config from './config.json'

function App() {
  const [provider,setProvider]=useState(null)
  const [block2,setBlock]=useState(null)
  
  const [account,setAccount]=useState(null)
  const [electronics,setElectronics]=useState(null)
  const [clothing,setClothing]=useState(null)
  const [toys,setToys]=useState(null)
  const [item, setItem] = useState({})
  const [toggle,setToggle]=useState(false)
  const togglePop=(item)=>{
    setItem(item)
    toggle ? setToggle(false):setToggle(true)
  }
  const loadBlockchainData=async()=>{
    //connecting to blockchain
    //this syntax used to 
    const provider=new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    //used to get the network we are connected to
    const network=await provider.getNetwork()
    //connect to smart contracts(load and create js versions of smart contracts)
    const block2=new ethers.Contract(config[network.chainId].block2.address,
    Block2,
    provider)
    setBlock(block2)

      //load products
    const items=[] //items array to add individual items
    for(var i=0;i<9;i++){
      const item=await block2.items(i+1)
      items.push(item)
    }
    const electronics = items.filter((item)=>item.category==='electronics')
    const clothing = items.filter((item)=>item.category==='clothing')
    const toys = items.filter((item)=>item.category==='toys')
    setElectronics(electronics)
    setClothing(clothing)
    setToys(toys)
  

  }
  useEffect(()=>{
    loadBlockchainData()
  },[])
  return (
    <div >
      
      <NavBar 
      account={account}
      setAccount={setAccount}/>
      <h2>Our Best Sellers!!</h2>
    {electronics&&(
      <>
      <Section title={'Clothing & Accessories'} items={clothing} togglePop={togglePop}/>
      <Section title={'Electronics'} items={electronics} togglePop={togglePop}/>
      <Section title={'Toys and Games'} items={toys} togglePop={togglePop}/> 
      </>
    )}{toggle &&(<Product item={item} provider={provider} block2={block2} account={account} togglePop={togglePop}/>)
    }
  
    </div>
      
  );
}

export default App;
