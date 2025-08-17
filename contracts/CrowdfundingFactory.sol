// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { Crowdfunding } from './Crowdfunding.sol';

contract CrowdfundingFactory {
    address public owner;
    bool public paused;

    struct Campagin {
        address campaginAddress;
        address owner;
        string name;
        uint256 creationTime;
    }

    Campagin[] public campagins;
    mapping(address => Campagin[]) public userCampagins;

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    modifier notPaused() {
        require(!paused, "Factory is paused");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createCampagin(
        string memory _name,
        string memory _description,
        uint256 _goal,
        uint256 _durationInDays
    ) external notPaused {
        Crowdfunding newCampagin = new Crowdfunding(
            msg.sender,
            _name,
            _description,
            _goal,
            _durationInDays
        );
        address campaginAddress = address(newCampagin);

        Campagin memory campagin = Campagin({
            campaginAddress: campaginAddress,
            owner: msg.sender,
            name: _name,
            creationTime: block.timestamp
        });

        campagins.push(campagin);
        userCampagins[msg.sender].push(campagin);
    }

    function getUserCampagins(address _user) external view returns (Campagin[] memory) {
        return userCampagins[_user];
    }

    function getAllCampaigns() external view returns (Campagin[] memory) {
        return campagins;
    }

    function togglePause() external onlyOwner {
        paused = !paused;
    }
}