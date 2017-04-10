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
    reorderLocalWatchlist: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      watchlists:[],
    };
  }

  componentDidMount(){
    const { localWatchlists } = this.props;
    if(!localWatchlists) return;
    this.setState({watchlists: localWatchlists})
  }

  componentWillReceiveProps(nextProps){
    const { localWatchlists } = nextProps;
    if(!localWatchlists) return;
    this.setState({watchlists: localWatchlists})
  }


  render() {
    const { instruments, positions, reorderLocalWatchlist } = this.props;
    const { watchlists } = this.state;

    return (
      <div className="draggableWatchlistsWrapper">
        {watchlists.map((localWatchlist, index)=>{
          return <List key={index}
                            watchlistIndex={index}
                            localWatchlist={localWatchlist}
                            instruments={instruments}
                            positions={positions}
                            reorderLocalWatchlist={reorderLocalWatchlist}/>
        })}
      </div>
    );
  }
}

export default flow([
  DragDropContext(HTML5Backend),
])(ListContainer);
