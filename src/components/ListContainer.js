import React, { Component, PropTypes } from 'react';

import update from 'react/lib/update';

import { DragDropContext, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import List from './List';

import {flow} from '../utils';

import '../styles/ListContainer.css'

const listTarget = {
  drop() {
  },
};

class ListContainer extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,

    localWatchlists: PropTypes.array.isRequired,
    instruments: PropTypes.object.isRequired,
    positions: PropTypes.array.isRequired,
    reorderLocalWatchlist: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      watchlists:[]
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
        let temp = {}
        temp.list = tempwatchlist.watchlist.filter((instrument)=>{
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

        temp.id = tempwatchlist.name;
        return temp;
      });

      this.setState({ watchlists: tempWatchlists });
    }

  }

  moveList = (id, atIndex) => {
    const { list, index } = this.findList(id);
    this.setState(update(this.state, {
      watchlists: {
        $splice: [
          [index, 1],
          [atIndex, 0, list],
        ],
      },
    }));

  }

  findList = (id) => {
    const { watchlists } = this.state;
    const list = watchlists.filter(c => c.id === id)[0];

    return {
      list,
      index: watchlists.indexOf(list),
    };
  }

  render() {
    const { reorderLocalWatchlists, reorderLocalWatchlist, connectDropTarget } = this.props;
    const { watchlists } = this.state;

    return connectDropTarget(
      <div className="draggableWatchlistsWrapper">
        {watchlists.map((localWatchlist, index)=>{
          return <List key={localWatchlist.id}
                       id={localWatchlist.id}
                       listName={localWatchlist.id}
                       list={localWatchlist.list}
                       reorderLocalWatchlist={(watchlist)=>reorderLocalWatchlist(index, watchlist)}
                       moveList={this.moveList}
                       findList={this.findList}
                       reorderLocalWatchlists={reorderLocalWatchlists}
                  />
        })}
      </div>
    );
  }
}

export default flow([
  DropTarget("LIST", listTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
  })),
  DragDropContext(HTML5Backend)
])(ListContainer);
