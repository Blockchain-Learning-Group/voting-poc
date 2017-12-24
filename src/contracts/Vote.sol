pragma solidity ^0.4.15;

contract Vote {
  uint256 public for_;
  uint256 public against_;
  string public question_;
  mapping(address => bool) hasVoted_;

  event LogError(string error);
  event LogVoteCast(bool vote);

  function Vote(string _question) public {
    question_ = _question;
  }

  function castVote(bool _vote) external {
      if (hasVoted_[msg.sender]) {
        LogError('User has already voted');
      } else {
        _vote ? for_ += 1 : against_ += 1;
        hasVoted_[msg.sender] = true;
        LogVoteCast(_vote);
      }
  }

  function getQuestion() external constant returns(string) {
      return question_;
  }
}
