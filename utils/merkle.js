const  { MerkleTree } = require('merkletreejs')
const  { ethers } = require("ethers")
const test_whitelist = require('../client_whitelists/test_whitelist');
const test_whitelist2 = require('../client_whitelists/test_whitelist2');


class Merkle {
    constructor(client) {
        if (client == "bfdc"){
            var whitelist = test_whitelist2
        } else {
            var whitelist = test_whitelist
        }
        this.whitelisted_addresses = whitelist.map(x => this.hashFunction(x))
      }
    
    hashFunction(address) {
        return Buffer.from(ethers.utils.solidityKeccak256(["address"], [address]).slice(2), "hex");
    }
    
    getMerkleTree() {
        const tree = new MerkleTree(this.whitelisted_addresses, this.hashFunction, { sortPairs: true })
        return tree
    }

    getMerkleRoot() {
        const tree = new MerkleTree(this.whitelisted_addresses, this.hashFunction, { sortPairs: true })
        return tree.getHexRoot()
    }

    getMerkleProof(address) {
        const tree = new MerkleTree(this.whitelisted_addresses, this.hashFunction, { sortPairs: true })
        const leaf = this.hashFunction(address)
        const proof = tree.getHexProof(leaf)
        return proof

    }
    verifyLeaf(address) {
        const tree = new MerkleTree(this.whitelisted_addresses, this.hashFunction, { sortPairs: true })
        const leaf = this.hashFunction(address)
        const proof = tree.getHexProof(leaf)
        const root = tree.getHexRoot()
        return tree.verify(proof, leaf, root)
    }
}

module.exports = Merkle