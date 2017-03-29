import React, { Component,PropTypes } from 'react'
import { connect } from 'react-redux'
import Autosuggest from 'react-autosuggest';
import '../styles/Search.css'
import { addInstrument       } from '../actions'
/* ----------- */
/*    Utils    */
/* ----------- */

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* --------------- */
/*    Component    */
/* --------------- */

const getSuggestionValue = (suggestion) => (suggestion.symbol);

const renderSuggestionsContainer = ({ containerProps , children, query }) => {
  return (
    <div {... containerProps} className="renderSuggestionsContainer">
      {children}
    </div>
  );
}

const renderInputComponent = inputProps => (
  <div className="renderInputComponent">
    <input {...inputProps} />
  </div>
);

class Search extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
      //isLoading: false
    };

    this.lastRequestId = null;
  }

  handleClick = suggestion => {
    suggestion.instrument = suggestion.url
    suggestion.type = "watchlist"
    console.log(suggestion)
    this.props.dispatch(addInstrument(suggestion))
    this.props.callback(suggestion);
  }

  renderSuggestion = (suggestion) => {
    return (
      <div className="suggestionSpan" onClick={()=>this.handleClick(suggestion)} >
        <div className="suggestionSymbol">{suggestion.symbol}</div>
        <div className="suggestionName">{suggestion.name}</div>
      </div>
    );
  }

  getMatchingInstruments = (value) => {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
      this.setState({
        //isLoading: false,
        suggestions: []
      });
    }

    return fetch(`https://api.robinhood.com/instruments/?query=${value}`, {
      method: 'GET',
      headers: new Headers({ 'Accept': 'application/json' })
    })
    .then(response => response.json())
    .then(jsonResult => {
      console.log(Array.isArray(jsonResult.results));
      this.setState({
        //isLoading: false,
        suggestions: jsonResult.results
      });
    })
    .catch(function(reason) {
      console.log(reason);
    });
  }

  onSuggestionSelected= (e)=>{
    this.setState({value:''})
  }

  loadSuggestions=(value)=> {
    this.setState({
      //isLoading: true
    });
    this.getMatchingInstruments(value);
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.loadSuggestions(value);
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;
        const inputProps = {
          placeholder: "SEARCH",
          value,
          onChange: this.onChange
        };

        return (
          <div>
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              onSuggestionSelected={this.onSuggestionSelected}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={this.renderSuggestion}
              renderSuggestionsContainer={renderSuggestionsContainer}
              renderInputComponent={renderInputComponent}
              inputProps={inputProps} />

          </div>
        );
      }
}

export default connect(null)(Search)
