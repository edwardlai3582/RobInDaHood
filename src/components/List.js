import React, { Component } from 'react'; //, PropTypes
import InlineEdit from 'react-edit-inline';
import { DragSource, DropTarget } from 'react-dnd';
import { capFirst } from '../utils'
import Symbol from './Symbol';
import {flow} from '../utils';

import '../styles/List.css'


class List extends Component {

	pushCard = (card) => {
		let tempList = this.props.list.slice(0);
    tempList.push(card);
    this.props.reorderLocalList(tempList);
	}

	removeCard = (index) => {
		let tempList = this.props.list.slice(0);
    tempList = [...tempList.slice(0,index), ...tempList.slice(index+1)];
    this.props.reorderLocalList(tempList);
	}

	moveCard = (dragIndex, hoverIndex) => {
		const { list } = this.props;
		const dragCard = list[dragIndex];

    let tempList = list.slice(0);
    tempList[dragIndex] = tempList[hoverIndex];
    tempList[hoverIndex] = dragCard;
    this.props.reorderLocalList(tempList);
	}

	dataChanged = (listName) => {
			// data = { description: "New validated text comes here" }
			// Update your model from here
			let name = listName.message;
			this.props.renameLocallistFolder(name);
	}

	customValidateText = (text) => {
		return (text.length > 0 && text !== "default" && text !== "Default" && this.props.noDuplicateName(text) );
	}

	render() {
		const { list, listName, instruments } = this.props;
		const { canDrop, isOver, isDragging, connectDragSource, connectDropTarget, connectDragPreview, deleteLocalListFolder } = this.props;
		const isActive = canDrop && isOver;

		const opacity = isDragging ? 0 : 1;
		const backgroundColor = isActive ? '#E0F7F1' : '#FFF';

		return connectDragPreview(connectDropTarget(
			<div style={{backgroundColor, opacity}} className="listWrapper">
				{connectDragSource(
					<div className="listHeaderWrapper">
						<h3>
							{(listName === "default")? (
								capFirst(listName)
							) : (
								<InlineEdit
		              validate={this.customValidateText}
		              activeClassName="editing"
		              text={`${listName}`}
		              paramName="message"
		              change={this.dataChanged}
									style={{cursor:"text"}}
		            />
							)}

						</h3>
						{(listName === "default")? null : (
							<button onClick={()=>deleteLocalListFolder()}>
								DELETE
							</button>
						)}
					</div>
				)}
				<section>
					{list.map((card, i) => {
						return (
							<Symbol
								key={instruments[card].symbol}
								symbol={instruments[card].symbol}
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
		/*
		if(props.id === "default") {
			return false;
		}
		*/
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

		props.reorderLocalLists(originalIndex, lastIndex);
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
    const { id: draggedId, type } = monitor.getItem();
    const { id: overId } = props;
		/////// props.id === "default"
		if(type === "CARD" ) {
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
		connectDragPreview: connect.dragPreview(),
	  isDragging: monitor.isDragging(),
	}))
])(List);
