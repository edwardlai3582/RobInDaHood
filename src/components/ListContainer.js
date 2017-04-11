import React, { Component, PropTypes } from 'react';
//import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import List from './List';

import {flow} from '../utils';

import '../styles/ListContainer.css'


class ListContainer extends Component {
  static propTypes = {
    localWatchlists: PropTypes.array.isRequired,
    instruments: PropTypes.object.isRequired,
    positions: PropTypes.array.isRequired,
    reorderLocalWatchlists: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      watchlists:[],
    };
  }

  componentDidMount(){
    const { localWatchlists, instruments, positions } = this.props;
    if(!localWatchlists) return;
    //this.setState({watchlists: localWatchlists})
    this.setWatchlistsData(localWatchlists, instruments, positions);
  }

  componentWillReceiveProps(nextProps){
    const { localWatchlists, instruments, positions } = nextProps;
    if(!localWatchlists) return;
    //this.setState({watchlists: localWatchlists})
    this.setWatchlistsData(localWatchlists, instruments, positions);
  }

  setWatchlistsData = (localWatchlists, instruments, positions) => {
    let instrumentsHasAllNeeded = true;

    for(let i=0; i<localWatchlists.length; i++ ){
      for(let j=0; j< localWatchlists[i].watchlist.length; j++){
        if(typeof instruments[localWatchlists[i].watchlist[j].instrument] === "undefined"){
          instrumentsHasAllNeeded = false;
          return null;
        }
      }
    }

    if(instrumentsHasAllNeeded && localWatchlists){
      let tempWatchlists = localWatchlists.map((tempwatchlist) => {
        let temp = tempwatchlist.watchlist.filter((instrument)=>{
          for(let i=0; i< positions.length; i++){
            if((positions[i].instrument === instrument.instrument)){
              return false;
            }
          }
          return true;
        })
        .map((instrument, i)=>{
          return {
            id: instruments[instrument.instrument].symbol,
            instrument: instrument.instrument,
            symbol: instruments[instrument.instrument].symbol,
            text: instruments[instrument.instrument].symbol,
            type: 'watchlist'
          };
        });

        return temp;
      });

      this.setState({ watchlists: tempWatchlists });
    }

  }

  render() {
    const { localWatchlists, reorderLocalWatchlists } = this.props;
    const { watchlists } = this.state;

    return (
      <div className="draggableWatchlistsWrapper">
        {watchlists.map((localWatchlist, index)=>{
          return <List key={localWatchlists[index].name}
                       id={localWatchlists[index].name}
                       listName={localWatchlists[index].name}
                       list={localWatchlist}
                       reorderLocalWatchlists={(watchlist)=>reorderLocalWatchlists(index, watchlist)}
                  />
        })}
      </div>
    );
  }
}

export default flow([
  DragDropContext(HTML5Backend),
])(ListContainer);
