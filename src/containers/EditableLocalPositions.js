import React, { Component } from 'react'
import { connect } from 'react-redux'

import SectionWrapper from '../components/SectionWrapper'
import ListContainer from '../components/ListContainer'

import {
  reorderLocalPosition,
  addLocalPositionFolder,
  deleteLocalPositionFolder,
  reorderLocalPositions,
  renameLocalPositionFolder,
} from '../actions'

import '../styles/News.css'

class EditableLocalPositions extends Component {

  addFolder = () => {
    const { onAddFolder, localPositions } = this.props;
    onAddFolder(localPositions.length);
  }

  render() {
    const {
      localPositions,
      instruments,
      // position handlers
      onDeleteFolder,
      onReorderPosition,
      onReorderLocalPosition,
      onRenameLocalPosition
    } = this.props;

    return (
      <SectionWrapper SectionTitle={""}>
        <div className="addFolderWrapper">
          <h6>Positions</h6>
          <button
            className="addFolderButton"
            onClick={ this.addFolder }
          >
            ADD FOLDER
          </button>
        </div>
        <ListContainer
          localLists={localPositions}
          instruments={instruments}
          checkLists={[]}
          reorderLocalList={ onReorderPosition }
          deleteLocalListFolder={ onDeleteFolder }
          reorderLocalLists={ onReorderLocalPosition }
          renameLocallistFolder={ onRenameLocalPosition }
        />
      </SectionWrapper>
    )
  }
}

const mapStateToProps = ({ localReducer, instrumentsReducer }, ownProps) => {
  const { localPositions = [] } = localReducer;
  const { instruments = {} } = instrumentsReducer;

  return { localPositions, instruments };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAddFolder: (folderIndex) => {
    dispatch(addLocalPositionFolder(`Folder ${folderIndex}`, []));
  },
  onDeleteFolder: (index, position ) => {
    dispatch(deleteLocalPositionFolder(index));
  },
  onReorderPosition: (positionIndex, position ) => {
    dispatch(reorderLocalPosition(positionIndex, position));
  },
  onReorderLocalPosition: (aI, bI) => {
    dispatch(reorderLocalPositions(aI, bI));
  },
  onRenameLocalPosition: (index, name) => {
    dispatch(renameLocalPositionFolder(index, name));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(EditableLocalPositions)
