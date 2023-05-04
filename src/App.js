import './App.css';
import { ethers } from 'ethers';
import Contract from './artifacts/contracts/Roulette.sol/Roulette.json';
import Profile from './components/Profile';
import Footer from './components/Footer';
import { WagmiConfig, createClient } from 'wagmi'
import { getDefaultProvider } from 'ethers'
import { Wheel } from 'react-custom-roulette'
import React from "react";
const BigNumber = require('bignumber.js');



const client = createClient({
    autoConnect: true,
    provider: getDefaultProvider(),
})

const data = [
    { option: '0', style: { backgroundColor: 'green', textColor: '#ffffff' } },
    { option: '32', style: { backgroundColor: 'red', textColor: '#ffffff' } },
    { option: '15', style: { backgroundColor: 'black', textColor: '#ffffff' } },
    { option: '19', style: { backgroundColor: 'red', textColor: '#ffffff' } },
    { option: '4', style: { backgroundColor: 'black', textColor: '#ffffff' } },
    { option: '21', style: { backgroundColor: 'red', textColor: '#ffffff' } },
    { option: '2', style: { backgroundColor: 'black', textColor: '#ffffff' } },
    { option: '25', style: { backgroundColor: 'red', textColor: '#ffffff' } },
    { option: '17', style: { backgroundColor: 'black', textColor: '#ffffff' } },
    { option: '34', style: { backgroundColor: 'red', textColor: '#ffffff' } },
    { option: '6', style: { backgroundColor: 'black', textColor: '#ffffff' } },
    { option: '27', style: { backgroundColor: 'red', textColor: '#ffffff' } },
    { option: '13', style: { backgroundColor: 'black', textColor: '#ffffff' } },
    { option: '36', style: { backgroundColor: 'red', textColor: '#ffffff' } },
    { option: '11', style: { backgroundColor: 'black', textColor: '#ffffff' } },
    { option: '30', style: { backgroundColor: 'red', textColor: '#ffffff' } },
    { option: '8', style: { backgroundColor: 'black', textColor: '#ffffff' } },
    { option: '23', style: { backgroundColor: 'red', textColor: '#ffffff' } },
    { option: '10', style: { backgroundColor: 'black', textColor: '#ffffff' } },
    { option: '5', style: { backgroundColor: 'red', textColor: '#ffffff' } },
    { option: '24', style: { backgroundColor: 'black', textColor: '#ffffff' } },
    { option: '16', style: { backgroundColor: 'red', textColor: '#ffffff' } },
    { option: '33', style: { backgroundColor: 'black', textColor: '#ffffff' } },
    { option: '1', style: { backgroundColor: 'red', textColor: '#ffffff' } },
    { option: '20', style: { backgroundColor: 'black', textColor: '#ffffff' } },
    { option: '14', style: { backgroundColor: 'red', textColor: '#ffffff' } },
    { option: '31', style: { backgroundColor: 'black', textColor: '#ffffff' } },
    { option: '9', style: { backgroundColor: 'red', textColor: '#ffffff' } },
    { option: '22', style: { backgroundColor: 'black', textColor: '#ffffff' } },
    { option: '18', style: { backgroundColor: 'red', textColor: '#ffffff' } },
    { option: '29', style: { backgroundColor: 'black', textColor: '#ffffff' } },
    { option: '7', style: { backgroundColor: 'red', textColor: '#ffffff' } },
    { option: '28', style: { backgroundColor: 'black', textColor: '#ffffff' } },
    { option: '12', style: { backgroundColor: 'red', textColor: '#ffffff' } },
    { option: '35', style: { backgroundColor: 'black', textColor: '#ffffff' } },
    { option: '3', style: { backgroundColor: 'red', textColor: '#ffffff' } },
    { option: '26', style: { backgroundColor: 'black', textColor: '#ffffff' } },
  ];
  



const contractAddress = " 0x5FbDB2315678afecb367f032d93F642f64180aa3"

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentAccount: "0x00000000000000000000",
            contract: null,
            provider: null,
            balanceContract: 0,
            balancesETH: 0,
            mustSpin: false,
            prizeNumber: 0,
            amountETH: 0,
        };
    }


    handleSpinClick = async (_random) => {
        if (!this.state.mustSpin) {
            const newPrizeNumber = _random;
            console.log(newPrizeNumber,"priz");
            this.setState({ prizeNumber: newPrizeNumber, mustSpin: true });
        }
    }

    async componentDidMount() {
        await this.requestAccountAndDatas();
    }

    requestAccountAndDatas = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length !== 0) {
            this.setState({ currentAccount: accounts[0] });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, Contract.abi, signer);
            this.setState({ contract: contract, provider: provider }, () => { this.requestDatas() });
        }
    }

    requestDatas = async () => {
        const balanceContract = await this.state.contract.getBalanceContract();
        const balancesETH = await this.state.contract.getMyBalance();
        this.setState({ balanceContract: ethers.utils.formatEther(balanceContract), balancesETH: ethers.utils.formatEther(balancesETH) });
    }


    betColor = async (_number,_amount) => {
        // this.amountETH is not a string so 
        // we need to convert it to a string
        const amount = _amount.toString();
        const data = await this.state.contract.betbyColor(_number, { value: ethers.utils.parseEther(amount) });
        // lsiten to the event Bet
        const tx = await data.wait();
        // get the event Bet
        const event = tx.events[0];
        console.log(event);

        // get the random number
        const random = event.args._random.toNumber();
        this.handleSpinClick(random);
        console.log(random,"random");

      

          
    }



        

    withdrawETH = async () => {
        await this.state.contract.withdraw();
    }

    
    

    render() {
        return (
            <div className="App mx-20 my-10">
                <WagmiConfig client={client}>
                    <Profile />
                </WagmiConfig>

                <p className="text-base text-white">
                    Vous avez : {this.state.balancesETH} ETH en attente de retrait
                </p>
                <p className="text-base text-white">
                   Le contract possede : {this.state.balanceContract} ETH 
                </p>

                <div className='flex justify-center'>
               
    <Wheel mustStartSpinning={this.state.mustSpin} prizeNumber={this.state.prizeNumber} data={data} onStopSpinning={() => { this.setState({ mustSpin: false }) }} />
                </div>
                <div className='flex justify-between'> 
                {/* input for amount ether value start amountETH */}
                <input type="number" className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4  font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" value={this.state.amountETH} onChange={(e) => { this.setState({ amountETH: e.target.value }); }} />
                

                </div>
                <div className='flex justify-between'> <button type="button"
                    onClick={() => this.betColor("1",this.state.amountETH)}  className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    Rouge
                </button>

                    <button type="button"
                        onClick={() => this.betColor("2",this.state.amountETH)}
                        className="text-white bg-black hover:bg-black-800 focus:ring-4  font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Noir
                    </button>

                    <button type="button"
                        onClick={() => this.betColor("0",this.state.amountETH)}
                        className="text-white bg-green-700 hover:bg-green-800 focus:ring-4  font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Vert
                    </button>
                    <button type="button"
                        onClick={() => this.betColor("0",this.state.amountETH)}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4  font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Pair
                    </button>
                    <button type="button"
                        onClick={() => this.betColor("0",this.state.amountETH)}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4  font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Impaire
                    </button>
                </div>
                <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-blue-700 dark:text-white">Balance du contract : {this.state.balanceContract}</span>
                </div>
                <div className="flex justify-center">
                <button type="button"
                    onClick={() => this.withdrawETH()}
                    className="mt-4 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    Retirer
                </button>
                </div>
                <Footer/>
            </div>
        
        );
    }
}

export default App;
