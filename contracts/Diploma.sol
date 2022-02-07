// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Diploma is ERC721, ERC721URIStorage, Ownable {
    event SendToStudent(address _college, address _student);

    mapping(string => uint8) existingURIs;

    constructor() ERC721("Diploma", "CSBC") {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function safeMint(address to, string memory uri, uint256 tokenId) public onlyOwner {
        require(tokenId <= 5, "Token outside of range");
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        existingURIs[uri] = 1;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function isContentOwned(string memory uri) public view returns (bool) {
        return existingURIs[uri] == 1;
    }

    function sendToStudent(uint256 tokenId, address college, address student) public payable {
        require(college == ownerOf(tokenId), "Wrong diploma probably.");
        _transfer(college, student, tokenId);

        emit SendToStudent(college, student);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}