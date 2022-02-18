import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { contractAbi, contractAddress } from '../utils/constant'

export const TransactionContext = React.createContext()

const { ethereum } = window

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const transactionContract = new ethers.Contract(contractAddress, contractAbi, signer)

  return transactionContract
}

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [formData, setformData] = useState({ addressTo: '', amount: '', keyword: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"))
  const [transactions, setTransactions] = useState([])

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  }

  const checkIfWalletIsConnected = async () => {
    try {

      if(!ethereum) return alert('Please install metaMask')

      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if(accounts.length) {
        setCurrentAccount(accounts[0])
      } else {
        console.log('No accounts found')
      }

      // console.log(accounts[0])
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.")

      const accounts = await ethereum.request({ method: "eth_requestAccounts", })

      setCurrentAccount(accounts[0])
      console.log(accounts[0])
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.")
      
      const { addressTo, amount, keyword, message } = formData
      
      const transactionContract = getEthereumContract()
      const parsedAmount = ethers.utils.parseEther(amount)

      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: currentAccount,
          to: addressTo,
          gas: '0x5208', // 2100 Gwei
          value: parsedAmount._hex,
        }]
      })

      const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword)
      setIsLoading(true)
      console.log(`Loading - ${transactionHash.hash}`)
      await transactionHash.wait()
      setIsLoading(false)
      console.log(`Successful - ${transactionHash.hash}`)
      console.log('Fired')

      const transactionsCount = await transactionsContract.getTransactionCount();
      
      setTransactionCount(transactionsCount.toNumber());
      
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])
  
  return (
    <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setformData, handleChange, sendTransaction }}>
      {children}
    </TransactionContext.Provider>
  )
}

