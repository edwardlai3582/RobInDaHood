import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import { DropTarget } from 'react-dnd';
//import HTML5Backend from 'react-dnd-html5-backend';
import Card from './Card';
import ItemTypes from './ItemTypes';

import {flow} from '../utils';

const style = {
  width: 100,
  padding: '5px 5px 20px',
  backgroundColor: 'yellow',
  marginRight: '10px'
};

const cardTarget = {
  drop(props,monitor,component) {
    console.log("Drop!");
    props.reorderLocalWatchlist(props.watchlistIndex, component.state.watchlistData);
  },
};

class List extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,

    watchlistIndex: PropTypes.number.isRequired,
    localWatchlist: PropTypes.object.isRequired,
    instruments: PropTypes.object.isRequired,
    positions: PropTypes.array.isRequired,
    reorderLocalWatchlist: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      watchlistData:[],
    };
  }

  setWatchlistData = (localWatchlist, instruments, positions) => {
    let instrumentsHasAllNeeded = true;

    for(let i=0; i< localWatchlist.watchlist.length; i++){
      if(typeof instruments[localWatchlist.watchlist[i].instrument] === "undefined"){
        instrumentsHasAllNeeded = false;
        return null;
      }
    }

    if(instrumentsHasAllNeeded && localWatchlist){
      let temp = localWatchlist.watchlist.filter((instrument)=>{
        for(let i=0; i< positions.length; i++){
          if((positions[i].instrument === instrument.instrument)){
            return false;
          }
        }
        return true;
      })
      .map((instrument, i)=>{
        return {
          id: i,
          instrument: instrument.instrument,
          symbol: instruments[instrument.instrument].symbol,
          type: 'watchlist'
        };
      });

      this.setState({watchlistData: temp})
    }
  }

  componentDidMount(){
    const { localWatchlist, instruments, positions } = this.props;
    if(!localWatchlist) return;
    this.setWatchlistData(localWatchlist, instruments, positions);
  }

  componentWillReceiveProps(nextProps){
    const { localWatchlist, instruments, positions } = nextProps;
    if(!localWatchlist) return;
    this.setWatchlistData(localWatchlist, instruments, positions);
  }

  moveCard = (id, atIndex) => {
    const { card, index } = this.findCard(id);
    this.setState(update(this.state, {
      watchlistData: {
        $splice: [
          [index, 1],
          [atIndex, 0, card],
        ],
      },
    }));
  }

  findCard = (id) => {
    const { watchlistData } = this.state;
    const card = watchlistData.filter(c => c.id === id)[0];

    return {
      card,
      index: watchlistData.indexOf(card),
    };
  }

  render() {
    const { connectDropTarget, localWatchlist } = this.props;
    const { watchlistData } = this.state;

    return connectDropTarget(
      <div style={style}>
        <h3 style={{backgroundColor: "salmon", marginBottom: "5px"}} >{localWatchlist.name}</h3>
        {watchlistData.map(card => (
          <Card
            key={card.id}
            id={card.id}
            text={card.symbol}
            moveCard={this.moveCard}
            findCard={this.findCard}
          />
        ))}
      </div>,
    );
  }
}

export default flow([
  DropTarget( ItemTypes.CARD, cardTarget, connect => ({ connectDropTarget: connect.dropTarget() }) )
])(List);
