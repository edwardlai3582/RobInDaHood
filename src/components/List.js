import React, { Component } from 'react'; //, PropTypes
//import update from 'react/lib/update';
import { DragSource, DropTarget } from 'react-dnd';

import Symbol from './Symbol';


import {flow} from '../utils';

import '../styles/List.css'


class List extends Component {
	constructor(props) {
		super(props);
		this.state = { watchlist: props.list };
	}

	pushCard(card) {
    let tempWatchlist = this.state.watchlist.slice(0);
    tempWatchlist.push(card);
		this.setState({ watchlist: tempWatchlist });
    this.props.reorderLocalWatchlist(tempWatchlist);
	}

	removeCard(index) {
    let tempWatchlist = this.state.watchlist.slice(0);
    tempWatchlist = [...tempWatchlist.slice(0,index), ...tempWatchlist.slice(index+1)]
    this.setState({ watchlist: tempWatchlist });
    this.props.reorderLocalWatchlist(tempWatchlist);
	}

	moveCard(dragIndex, hoverIndex) {
		const { watchlist } = this.state;
		const dragCard = watchlist[dragIndex];

    let tempWatchlist = this.state.watchlist.slice(0);
    tempWatchlist[dragIndex] = tempWatchlist[hoverIndex];
    tempWatchlist[hoverIndex] = dragCard;
    /*
		this.setState(update(this.state, {
			watchlist: {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, dragCard]
				]
			}
		}));
    this.props.reorderLocalWatchlists();
    */
    this.setState({ watchlist: tempWatchlist });
    this.props.reorderLocalWatchlist(tempWatchlist);
	}

	render() {
		const { watchlist } = this.state;
		const { canDrop, isOver, isDragging, connectDragSource, connectDropTarget, listName } = this.props;
		const isActive = canDrop && isOver;

		const opacity = isDragging ? 0 : 1;
		const backgroundColor = isActive ? '#E0F7F1' : '#FFF';

		return connectDragSource(connectDropTarget(
			<div style={{backgroundColor, opacity}} className="listWrapper">
				{(listName === "default")? null : (<h3>{listName}</h3>)}
				<section>
					{watchlist.map((card, i) => {
						return (
							<Symbol
								key={card.id}
								index={i}
								listId={this.props.id}
								card={card}
								removeCard={this.removeCard.bind(this)}
								moveCard={this.moveCard.bind(this)} />
						);
					})}
				</section>
			</div>
		));
  }
}

const listSource = {
	canDrag(props, monitor) {
		if(props.id === "default") {
			return false;
		}
		return true;
	},

  beginDrag(props) {
    return {
      id: props.id,
      originalIndex: props.findList(props.id).index,
			lastIndex: props.findList(props.id).index,
			type: 'LIST'
    };
  },

  endDrag(props, monitor) {
    const { id: droppedId, originalIndex, lastIndex } = monitor.getItem();
    const didDrop = monitor.didDrop();

    if (!didDrop) {
      props.moveList(droppedId, originalIndex);
    }

		props.reorderLocalWatchlists(originalIndex, lastIndex);
  },
};

const cardListTarget = {
  canDrop(props, monitor) {
		const { type } = monitor.getItem();
		if(type === "LIST"){
			return false;
		}
    return true;
  },

  hover(props, monitor) {
    const { id: draggedId, originalIndex, type } = monitor.getItem();
    const { id: overId } = props;

		if(type === "CARD" || props.id === "default" ) {
			return;
		}

    if (draggedId !== overId) {
      const { index: overIndex } = props.findList(overId);
      props.moveList(draggedId, overIndex);
			monitor.getItem().lastIndex = overIndex;
    }
  },

	drop(props, monitor, component ) {
		const { id } = props;
		const sourceObj = monitor.getItem();

		if(sourceObj.type === "LIST") {
			return;
		}

		if ( id !== sourceObj.listId ) component.pushCard(sourceObj.card);
		return {
			listId: id
		};
	}
};


export default flow([
  DropTarget(["CARD", "LIST"], cardListTarget, (connect, monitor) => ({
  	connectDropTarget: connect.dropTarget(),
  	isOver: monitor.isOver(),
  	canDrop: monitor.canDrop()
  })),
	DragSource("LIST", listSource, (connect, monitor) => ({
	  connectDragSource: connect.dragSource(),
	  isDragging: monitor.isDragging(),
	}))
])(List);
