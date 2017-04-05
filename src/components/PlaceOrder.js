import React, { Component } from 'react'
import Modal from 'react-modal'
import NumericInput from 'react-numeric-input';
import '../styles/PlaceOrder.css'

const [ MARKET, LIMIT ] = [ "market", "limit" ];
const [ GFD, GTC ] = [ "gfd", "gtc" ];
const [ IMMEDIATE, STOP ] = [ "immediate", "stop" ];
const [ BUY, SELL ] = [ "buy", "sell" ];
const typeNames = {
  MARKET: "MARKET",
  LIMIT: "LIMIT",
  STOP_LOSS: "STOP LOSS",
  STOP_LIMIT: "STOP LIMIT"
}

const numInputStyle = {
  btn: {
    background: "white"
  }
}

const customStyles = {
  content : {
    top                   : '50px',
    backgroundColor       : 'white',
    color                 : 'black',
    textAlign             : 'left',
    padding               : '0px'
  },
  overlay :{ zIndex: 999 }
};

class PlaceOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderStage: "notyet", //"ing", "confirmPage", "Succeeded", "Failed"
      modalIsOpen: false,
      shouldCloseOnOverlayClick: true,
      typeName: typeNames.MARKET,
      type: MARKET, //or 'limit'
      time_in_force: GFD, //gfd, gtc
      trigger: IMMEDIATE, //or stop
      price: 0.00, //Only when type equals limit
      stop_price: 0.00, //Only when trigger equals stop
      quantity: 0,
      priceWarning: "",
      stop_priceWarning: "",
      quantityWarning: "",
      side: SELL,
      resultWarning: ""
    };
  }

  componentWillReceiveProps(nextProps){
    this.setState({shouldCloseOnOverlayClick: !nextProps.placingOrder});

    if(nextProps.placingOrder){
      this.setState({orderStage: "ing"});
    }
    if(!nextProps.placingOrder && this.props.placingOrder && this.state.orderStage === "ing"){
      if(nextProps.orderPlacedResult === "succeeded"){
        this.setState({orderStage: "Succeeded"});
      }
      else{
        this.setState({orderStage: "Failed"});
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    //if(nextProps.shares === this.props.shares && nextState.modalIsOpen === this.state.modalIsOpen) return false;
    return true;
  }

  openModal = (side) => {
    this.setState({
      orderStage: "notyet",
      modalIsOpen: true, side: side,
      typeName: typeNames.MARKET,
      type: MARKET,
      time_in_force: GFD,
      trigger: IMMEDIATE,
      price: 0.00,
      stop_price: 0.00,
      quantity: 0,
      priceWarning: "",
      stop_priceWarning: "",
      quantityWarning: "",
      resultWarning: ""
     });
  }

  closeModal = () => {
    this.setState({modalIsOpen: false});
  }

  handleTypeNameChange = (e) => {
    switch(e.target.value) {
        case typeNames.MARKET:
          this.setState({typeName:typeNames.MARKET, type: MARKET, time_in_force: GFD, trigger: IMMEDIATE});
          break;
        case typeNames.LIMIT:
          this.setState({typeName:typeNames.LIMIT, type: LIMIT, trigger: IMMEDIATE});
          break;
        case typeNames.STOP_LOSS:
          this.setState({typeName:typeNames.STOP_LOSS, type: MARKET, trigger: STOP});
          break;
        case typeNames.STOP_LIMIT:
          this.setState({typeName:typeNames.STOP_LIMIT, type: LIMIT, trigger: STOP});
          break;
        default:
          this.setState({typeName:typeNames.MARKET, type: MARKET, time_in_force: GFD, trigger: IMMEDIATE});
    }
  }

  handleTime_in_forceChange = (e) => {
    switch(e.target.value) {
        case GFD:
          this.setState({ time_in_force: GFD });
          break;
        case GTC:
          this.setState({ time_in_force: GTC });
          break;
        default:
          this.setState({ time_in_force: GFD });
    }
  }

  handleChange = (key) => (quantity) => {
    let tempObj = {};
    tempObj[key] = quantity || 0;
    this.setState(tempObj);
  }

  handleBlur = (key) => (e) => {
    let tempObj = {};
    if(Number(e.target.value) <= 0){
      tempObj[key] = "Need to be larger than 0.";
    }
    else { tempObj[key] = ""; }
    this.setState(tempObj);
  }

  handleFocus = (key) => (e) => {
    let tempObj = {};
    tempObj[key] = "";
    tempObj["resultWarning"] = "";
    this.setState(tempObj);
  }

  handleOrder = () => {
    const { typeName, quantity, price, stop_price, side, type, trigger } = this.state;
    const { currentPrice, shares, cashCanUse } = this.props;
    //check input==0
    if(quantity === 0) {
      this.setState({quantityWarning: "Need to be larger than 0."});
      return;
    }
    if(typeName === typeNames.LIMIT){
      if(price === 0) {
        this.setState({priceWarning: "Need to be larger than 0."});
        return;
      }
    }
    if(trigger === STOP){
      if(stop_price === 0) {
        this.setState({stop_priceWarning: "Need to be larger than 0."});
        return;
      }
    }
    if(type === LIMIT){
      if(price === 0) {
        this.setState({priceWarning: "Need to be larger than 0."});
        return;
      }
    }
    //check result
    if(side === BUY){
      if((quantity * Number(currentPrice)) > Number(cashCanUse)){
        this.setState({resultWarning: "You don't have enough cash to buy!"});
        return;
      }
    }
    else {
      if(quantity > shares){
        this.setState({resultWarning: `You only have ${Number(shares)} shares to sell!`});
        return;
      }
    }

    this.setState({orderStage: "confirmPage"});
  }

  backToNotYet = () => {
    this.setState({orderStage: "notyet"});
  }

  confirmOrder = () => {
    const { quantity, price, stop_price, side, time_in_force, type, trigger } = this.state;
    const { symbol, currentPrice, placeOrder, accountUrl, instrumentUrl } = this.props;

    let orderObj = {};
    orderObj.account = accountUrl;
    orderObj.instrument = instrumentUrl;
    orderObj.symbol = symbol;
    orderObj.type = type;
    if(type === LIMIT){ orderObj.price = price; }
    else{ orderObj.price = Number(currentPrice); }
    orderObj.time_in_force = time_in_force;
    orderObj.trigger = trigger;
    if(trigger === STOP){ orderObj.stop_price = stop_price; }
    orderObj.quantity = quantity;
    orderObj.side = side;

    console.log(orderObj);
    placeOrder(orderObj);
  }

  render() {
    const { side, type, quantity, price, trigger, typeName, stop_price, time_in_force,
            priceWarning, stop_priceWarning, quantityWarning, resultWarning,
            modalIsOpen, shouldCloseOnOverlayClick,
            orderStage
          } = this.state;
    const { currentPrice, shares, cashCanUse, symbol, orderPlacedResult } = this.props;
    console.log(orderStage);
    let resultBlock = (
      <div className="resultWrapper">
        <div className="orderOptionName"> {(side === BUY)? "Estimated Cost" : "Estimated Credit"} </div>
        <div className="orderOption">
          {(type === MARKET)?
            (trigger === STOP)? (
              `$${stop_price.toFixed(2)} x ${quantity} = $${(stop_price*quantity).toFixed(2)}`
            ) : (
              `$${Number(currentPrice).toFixed(2)} x ${quantity} = $${(Number(currentPrice)*quantity).toFixed(2)}`
            )
          : (
            `$${price.toFixed(2)} x ${quantity} = $${(price*quantity).toFixed(2)}`
          )}
          <div className="orderWarning">{ resultWarning }</div>
        </div>
      </div>
    );

    let cashOrSharesBloack =  (
      <div className="orderOptionWrapper grey">
        <div className="orderOptionName">{(side === BUY)?"Cash available":"Shares available"}</div>
        <div className="orderOption">
          {(side === BUY)?`${Number(cashCanUse)}` : `${Number(shares)}` }
        </div>
      </div>
    );

    let marketPriceBlock = (typeName === typeNames.MARKET)? (
      <div className="orderOptionWrapper">
        <div className="orderOptionName">Market Price</div>
        <div className="orderOption">
          { `$${Number(currentPrice).toFixed(2)}` }
        </div>
      </div>
    ) : (
      <div className="orderOptionWrapper green">
        <div className="orderOptionName">Current Price</div>
        <div className="orderOption">
          { `$${Number(currentPrice).toFixed(2)}` }
        </div>
      </div>
    );

    let time_in_forceBlock = (typeName !== typeNames.MARKET)? (
      <div className="orderOptionWrapper">
        <div className="orderOptionName">Time in Force</div>
        <div className="orderOption">
          <div>
            <input type="radio" name="time_in_force"
                   id={GFD}
                   value={GFD}
                   checked={time_in_force === GFD}
                   onChange={this.handleTime_in_forceChange}
            />
          <label htmlFor={GFD} >Good for day</label>
          </div>
          <div>
            <input type="radio" name="time_in_force"
                   id={GTC}
                   value={GTC}
                   checked={time_in_force === GTC}
                   onChange={this.handleTime_in_forceChange}
            />
          <label htmlFor={GTC} >Good till canceled</label>
          </div>
        </div>
      </div>
    ):null;

    let priceBlock = (type === LIMIT)? (
      <div className="orderOptionWrapper">
        <div className="orderOptionName">Limit Price</div>
        <div className="orderOption">
          $<NumericInput step={0.01} min={0} precision={2} value={price.toFixed(2)}
            onChange={this.handleChange("price")}
            onBlur={this.handleBlur("priceWarning")}
            onFocus={this.handleFocus("priceWarning")}
            style={numInputStyle}
          />
          <div className="orderWarning">{priceWarning}</div>
        </div>
      </div>
    ) : null;

    let stop_priceBlock = (trigger === STOP)? (
      <div className="orderOptionWrapper">
        <div className="orderOptionName">Stop Price</div>
        <div className="orderOption">
          $<NumericInput step={0.01} min={0} precision={2} value={stop_price.toFixed(2)}
            onChange={this.handleChange("stop_price")}
            onBlur={this.handleBlur("stop_priceWarning")}
            onFocus={this.handleFocus("stop_priceWarning")}
            style={numInputStyle}
          />
          <div className="orderWarning">{stop_priceWarning}</div>
        </div>
      </div>
    ) : null;

    return (
      <div className="placeOrderWrapper">
        <div className="tradeButtonWrapper">
          {(Number(shares) !== 0)?(
            <button className="tradeButton" onClick={()=>this.openModal(SELL)} >SELL</button>
          ):null}
          <button className="tradeButton" onClick={()=>this.openModal(BUY)} >BUY</button>
        </div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="News Modal"
          shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
        >
          {(orderStage === "notyet")? (
            <div>
              <header className="placeOrderHeader">
                <h2> { symbol } </h2>
                <h3> { side.toUpperCase() } </h3>
              </header>

              <section className="placeOrderSection">
                <div className="orderOptionWrapper">
                  <div className="orderOptionName"> Type</div>
                  <div className="orderOption">
                    <select value={typeName} onChange={this.handleTypeNameChange}>
                      <option value={typeNames.MARKET}>{typeNames.MARKET}</option>
                      <option value={typeNames.LIMIT}>{typeNames.LIMIT}</option>
                      <option value={typeNames.STOP_LOSS}>{typeNames.STOP_LOSS}</option>
                      <option value={typeNames.STOP_LIMIT}>{typeNames.STOP_LIMIT}</option>
                    </select>
                  </div>
                </div>

                { time_in_forceBlock }
                { stop_priceBlock }
                { priceBlock }
                { marketPriceBlock }

                <div className="orderOptionWrapper">
                  <div className="orderOptionName">Shares of {this.props.symbol}</div>
                  <div className="orderOption">
                    <NumericInput step={1} min={0} value={quantity}
                      onChange={this.handleChange("quantity")}
                      onBlur={this.handleBlur("quantityWarning")}
                      onFocus={this.handleFocus("quantityWarning")}
                      style={numInputStyle}
                    />
                    <div className="orderWarning">{quantityWarning}</div>
                  </div>
                </div>

                { cashOrSharesBloack }
                { resultBlock }

                <div className="placeOrderButtonsWrapper">
                  <button className="placeOrderButton cancel" onClick={this.closeModal}>CANCEL</button>
                  <button className="placeOrderButton" onClick={this.handleOrder}>PLACE ORDER</button>
                </div>

              </section>
            </div>
          ):(orderStage==="confirmPage")?(
            <div>
              <header className="placeOrderHeader">
                <h2> { symbol } </h2>
                <h3> { side.toUpperCase() } </h3>
              </header>

              <section className="placeOrderSection">
                <div className="orderOptionWrapper">
                  <div className="orderOptionName"> Type </div>
                  <div className="orderOption">
                    { typeName }
                  </div>
                </div>

                {(typeName !== typeNames.MARKET)? (
                  <div className="orderOptionWrapper">
                    <div className="orderOptionName">Time in Force</div>
                    <div className="orderOption">
                      {(time_in_force === GFD)?"Good for day":"Good till canceled"}
                    </div>
                  </div>
                ) : null}

                {(typeName === typeNames.MARKET)? (
                  <div className="orderOptionWrapper">
                    <div className="orderOptionName">Market Price</div>
                    <div className="orderOption">
                      { `$${Number(currentPrice).toFixed(2)}` }
                    </div>
                  </div>
                ) : null}

                {(trigger === STOP)? (
                  <div className="orderOptionWrapper">
                    <div className="orderOptionName">Stop Price</div>
                    <div className="orderOption">
                      {`$${stop_price}`}
                    </div>
                  </div>
                ): null}

                {(type === LIMIT)? (
                  <div className="orderOptionWrapper">
                    <div className="orderOptionName">Limit Price</div>
                    <div className="orderOption">
                      {`$${price}`}
                    </div>
                  </div>
                ): null}

                <div className="orderOptionWrapper">
                  <div className="orderOptionName">Shares of {this.props.symbol}</div>
                  <div className="orderOption">
                    { quantity }
                  </div>
                </div>

                { cashOrSharesBloack }
                { resultBlock }

                <div className="placeOrderButtonsWrapper">
                  <button className="placeOrderButton cancel" onClick={this.backToNotYet}>CANCEL</button>
                  <button className="placeOrderButton" onClick={this.confirmOrder}>CONFIRM</button>
                </div>

              </section>
            </div>
          ) : (orderStage==="ing")?(
            <div className="orderingDiv">Ordering...</div>
          ):(
            <div className="orderedDivWrapper">
              <div className="orderedDiv">{`Order ${orderStage}`}</div>
              {(orderPlacedResult !== "succeeded")?(
                <div className="orderedReasonDiv">
                  {orderPlacedResult}
                </div>
              ):null}
              <button onClick={this.closeModal} className="orderedButton">CLOSE</button>
            </div>
          )}

        </Modal>
      </div>
    )
  }
}

export default PlaceOrder
