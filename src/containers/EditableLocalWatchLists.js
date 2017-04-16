import React, { Component } from 'react'
import { connect } from 'react-redux'

import SectionWrapper from '../components/SectionWrapper'
import ListContainer from '../components/ListContainer'

import {
  reorderLocalWatchlist,
  addLocalWatchlistFolder,
  deleteLocalWatchlistFolder,
  reorderLocalWatchlists,
  renameLocalWatchlistFolder,
} from '../actions'

import '../styles/News.css'

class EditableLocalWatchLists extends Component {

  addFolder = () => {
    const { onAddWatchListFolder, localPositions } = this.props;
    onAddWatchListFolder(localPositions.length);
  }

  render() {
    const {
      localWatchlists,
      instruments,
      positions,
      // watchlists handlers
      onDeleteWatchListFolder,
      onReorderWatchList,
      onReorderLocalWatchList,
      onRenameWatchListFolder
    } = this.props;

    return (
      <SectionWrapper SectionTitle={""}>
        <div className="addFolderWrapper">
          <h6>Watchlists</h6>
          <button
            className="addFolderButton"
            onClick={ this.addFolder }
          >
            ADD FOLDER
          </button>
        </div>
        <ListContainer
          localLists={localWatchlists}
          instruments={instruments}
          checkLists={positions}
          reorderLocalList={ onReorderWatchList }
          deleteLocalListFolder={ onDeleteWatchListFolder }
          reorderLocalLists={ onReorderLocalWatchList }
          renameLocallistFolder={ onRenameWatchListFolder }
        />
      </SectionWrapper>
    )
  }
}

const mapStateToProps = ({ localReducer, instrumentsReducer, positionsReducer }, ownProps) => {
  const { localWatchlists = [] } = localReducer;
  const { instruments = {} } = instrumentsReducer;
  const { positions = [] } = positionsReducer;

  return { localWatchlists, instruments, positions };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAddWatchListFolder: (folderIndex) => {
    dispatch(addLocalWatchlistFolder(`Folder ${folderIndex}`));
  },
  onDeleteWatchListFolder: (index) => {
    dispatch(deleteLocalWatchlistFolder(index));
  },
  onReorderWatchList: (watchlistIndex, watchlist) => {
    dispatch(reorderLocalWatchlist(watchlistIndex, watchlist));
  },
  onReorderLocalWatchList: (aI, bI) => {
    dispatch(reorderLocalWatchlists(aI, bI));
  },
  onRenameWatchListFolder: (index, name) => {
    dispatch(renameLocalWatchlistFolder(index, name));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditableLocalWatchLists)
