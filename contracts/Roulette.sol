pragma solidity ^0.8.0;


contract Roulette {
    address public owner;
    mapping(address => uint256) public balances;
    uint[] public red = [1, 3, 5, 7, 9, 12, 14, 16, 18, 21, 23, 25, 27, 30 ,32, 34, 36];
    uint[] public black = [2, 4, 6, 8, 10, 11, 13, 15, 17, 19, 20 ,22, 24, 26, 28, 29, 31, 33, 35];


    constructor(
    ) {
        owner = msg.sender;
    }
// add event for the bet
    event Bet(address indexed _from, uint256 _value, uint256 _random,uint256 _choice);
 
    function betbyColor(uint _choice) public payable returns (uint256){
       

        require(_choice >= 0 && _choice <= 2, "Choix entre 0 et 2");
        require(msg.value > 0.01 ether, "> 0.01 ether obligatoire ");
        require(balances[msg.sender] == 0, "Un bet a la fois");
        uint _random = randomRoulette();
        if (_choice == 0) {
            if (_random == 0) {
                balances[msg.sender] = msg.value * 36;
            }
        } else if (_choice == 1) {
            for (uint i = 0; i < red.length; i++) {
                if (_random == red[i]) {
                    balances[msg.sender] = msg.value * 2;
                }
            }
        } else {
            for (uint i = 0; i < black.length; i++) {
                if (_random == black[i]) {
                    balances[msg.sender] = msg.value * 2;
                }
            }
        }
        emit Bet(msg.sender, msg.value, _random,_choice);
        return _random;
    }
     function betByExactNumber(uint _choice) public payable {

        require(_choice >= 0 && _choice <= 36, "Choix entre 0 et 36");
        require(msg.value > 0.01 ether, "> 0.01 ether obligatoire ");
        require(balances[msg.sender] == 0, "Un bet a la fois");
        uint _random = randomRoulette();
        if (_random == _choice) {
            balances[msg.sender] = msg.value * 36;
        }
    }

 function betByOddOrEven(uint _choice) public payable {

        require(_choice >= 0 && _choice <= 36, "Choix entre 0 et 36");
        require(msg.value > 0.01 ether, "> 0.01 ether obligatoire ");
        require(balances[msg.sender] == 0, "Un bet a la fois");
        uint _random = randomRoulette();
        if (_random % 2 == 0) {
            if (_choice == 2) {
                balances[msg.sender] = msg.value * 2;
            }
        } else {
            if (_choice == 1) {
                balances[msg.sender] = msg.value * 2;
            }
        }
    }

    function randomRoulette () public view  returns (uint) {
       return uint(keccak256(abi.encodePacked(block.timestamp, block.number)))%37;
     
    }


    function withdraw() public {
        
        require(balances[msg.sender] > 0, "Vous n'avez pas wahda");
        require(address(this).balance >= balances[msg.sender], "Le contrat n'a pas assez de fonds");
        uint256 amount = balances[msg.sender];
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

 function getMyBalance() public view returns (uint256) {
        return balances[msg.sender];
 }

 function getBalanceContract() public view returns (uint256) {
        return address(this).balance;
 }

}

