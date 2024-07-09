pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract UITCertificate is ERC721URIStorage {
    using Counters for Counters.counter;
    Counters.Counter private _tokenIdCounter;

    mapping(string => uint8) existingURIs;

    constructor() ERC721("UIT Graduation Certificate", "UGC") {}
    
    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function createCertificate(uint256 studentID, string memory tokenURI) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, studentID);
        _setTokenURI(studentID, tokenURI);
    }

    function count() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
}

