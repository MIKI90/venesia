pragma solidity ^0.4.11;
contract PagoTransporte {
    uint public value;
    address public seller;
    address public buyer;
    enum State { Created, Locked, Inactive }
    State public state;

    function PagoTransporte() payable {
        seller = msg.sender;
    }

    modifier condition(bool _condition) {
        require(_condition);
        _;
    }

    modifier onlyBuyer() {
        require(msg.sender == buyer);
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller);
        _;
    }

    modifier inState(State _state) {
        require(state == _state);
        _;
    }

    event aborted();
    event canceled();
    event purchaseConfirmed();
    event itemReceived();

    function abort()
        onlySeller
        inState(State.Created)
    {
        aborted();
        state = State.Inactive;
        seller.transfer(this.balance);
    }

    function cancel()
        onlyBuyer
        inState(State.Created)
    {
        canceled();
        state = State.Inactive;
        uint devolucionSeller = this.balance / 2;
        uint devolucionBuyer = this.balance / 2;
        seller.transfer(devolucionSeller);
        buyer.transfer(devolucionBuyer);
    }

  function confirmPurchase()
        inState(State.Created)
        payable
    {
        purchaseConfirmed();
        value = msg.value;
        buyer = msg.sender;
        state = State.Locked;
    }

    function confirmReceived()
        onlyBuyer
        inState(State.Locked)
    {
        itemReceived();
              state = State.Inactive;

        //buyer.transfer(value);
        //seller.transfer(this.balance);
        seller.transfer(value);
    }
}
