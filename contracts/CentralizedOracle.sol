// CentralizedOracle.sol

pragma solidity 0.5.16;

contract CentralizedOracle {
  mapping (uint256 => mapping(uint256 => uint256)) public values;
  mapping (uint256 => Metadata) metadata;
  uint256 datasetCount;

  struct Metadata {
    uint256 retrievalId;
    uint256 timestampWindow;
    uint256 valueWindow;
    address token;
    uint256 minDeposit;
    uint256 slashAmount;
    address oracle;
    uint256 disputeDelay;
  }

  constructor() public {datasetCount=0;}

  function newDataset(
      uint256 _retrievalId,
      uint256 _timestampWindow,
      uint256 _valueWindow,
      address _token,
      uint256 _minDeposit,
      uint256 _slashAmount,
      address _oracle,
      uint256 _disputeDelay)
      public {

      metadata[datasetCount] = Metadata({
          retrievalId: _retrievalId,
          timestampWindow: _timestampWindow,
          valueWindow: _valueWindow,
          token: _token,
          minDeposit: _minDeposit,
          slashAmount: _slashAmount,
          oracle: _oracle,
          disputeDelay: _disputeDelay
      });
  }
}
