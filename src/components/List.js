import React, { Component } from 'react'; //, PropTypes
//import update from 'react/lib/update';
import { DropTarget } from 'react-dnd';

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
    this.props.reorderLocalWatchlists(tempWatchlist);
	}

	removeCard(index) {
    let tempWatchlist = this.state.watchlist.slice(0);
    tempWatchlist = [...tempWatchlist.slice(0,index), ...tempWatchlist.slice(index+1)]
    this.setState({ watchlist: tempWatchlist });
    this.props.reorderLocalWatchlists(tempWatchlist);
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
    this.props.reorderLocalWatchlists(tempWatchlist);
	}

	render() {
		const { watchlist } = this.state;
		const { canDrop, isOver, connectDropTarget, listName } = this.props;
		const isActive = canDrop && isOver;

		const backgroundColor = isActive ? '#E0F7F1' : '#FFF';

		return connectDropTarget(
			<div style={{backgroundColor}} className="listWrapper">
				<h3>{listName}</h3>
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
		);
  }
}

const cardTarget = {
	drop(props, monitor, component ) {
		const { id } = props;
		const sourceObj = monitor.getItem();
		if ( id !== sourceObj.listId ) component.pushCard(sourceObj.card);
		return {
			listId: id
		};
	}
}

export default flow([
  DropTarget("CARD", cardTarget, (connect, monitor) => ({
  	connectDropTarget: connect.dropTarget(),
  	isOver: monitor.isOver(),
  	canDrop: monitor.canDrop()
  }))
])(List);
