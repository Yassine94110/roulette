// Importer les bibliothèques nécessaires
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('CyasInu', function () {
    let CyasInu;
    let cyasInu;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    // Déployer le contrat avant chaque test
    beforeEach(async function () {
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        CyasInu = await ethers.getContractFactory('CyasInu');
        cyasInu = await CyasInu.connect(owner).deploy();
        await cyasInu.deployed();
    });

    // Test de la création du contrat
    describe('Création', function () {
        it('La création doit attribuer un nom et un symbole', async function () {
            expect(await cyasInu.name()).to.equal('CyasInu');
            expect(await cyasInu.symbol()).to.equal('CYAS');
        });

        it('Le propriétaire doit recevoir le montant initial', async function () {
            expect(await cyasInu.balanceOf(owner.address)).to.equal('1000000000000000000000000');
        });
    });
});