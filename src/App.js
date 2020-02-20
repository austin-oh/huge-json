/**
 * Read and parse the huge json.
 * url: https://blitz-cdn-plain.blitz.gg/blitz/team-coaching/json/lcs-1.json
 */

import React, { Component } from 'react';
import './App.css';
import Logger from './components/Logger/Logger';
import Loading from './components/Loading/Loading';
import { readJSONStream } from './utils/JsonStream';
import { READ_MODE } from './Constants';
const { ipcRenderer } = window.require('electron');
const srcURL = "https://blitz-cdn-plain.blitz.gg/blitz/team-coaching/json/lcs-1.json";

// const READ_MODE = {
//   whole: "READ_WHOLE_FILE",
//   streaming: "READ_BY_KEY"
// }


class App extends Component {

  constructor(props) {
    super(props)
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleSelectKey = this.handleSelectKey.bind(this);
    this.handleReadingModeChange = this.handleReadingModeChange.bind(this);

    this.state = {
      primaryKeys: [
        { name: 'Header', value: 'header' },
        { name: 'Events', value: 'events' },
        { name: 'Timelines', value: 'timeline' }
      ],
      selectedKey: 'header',
      logContent: '',
      readingMode: READ_MODE.whole,
      readData: {},
      processig: false,
    }

    ipcRenderer.on('HUGE_JSON_REPLY', (event, arg) => {
      console.log(arg);
      this.setState({ processig: false });
    })
  }

  handleOnClick() {
    ipcRenderer.send('READ_HUGE_JSON', {
      mode: this.state.readingMode,
      key: this.state.selectedKey,
      url: srcURL,
    });
    this.setState({ processig: true });
    // let log = `[Reading File] starting with key: ${this.state.selectedKey} ...`; this.addLog(log);

    // const path = "src/assets/huge.json";
    // const key = this.state.selectedKey;
    // readJSONStream(path, key)
    //   .then(result => {
    //     this.setState({ readData: result.data });

    //     log = `[Reading File] finished in ${parseFloat(result.executeTime / 1000)}s.`; this.addLog(log);
    //     // results
    //     const isArray = Array.isArray(result.data);
    //     const count = isArray ? result.data.length : Object.keys(result.data).length;
    //     const unit = isArray ? 'children' : 'keys';
    //     log = `[Result] contains ${count} ${unit}.`; this.addLog(log);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  }

  addLog(log) {
    this.setState({ logContent: this.state.logContent + '\n' + log });
  }

  handleSelectKey(e) {
    this.setState({ selectedKey: e.target.value });
  }

  handleReadingModeChange(e) {
    this.setState({ readingMode: e.currentTarget.value });
  }

  render() {
    return (
      <>
      <Loading loading={this.state.processig} />
      <div className="App">
        <div className="flex-container App-option-container">
          <div>
            <div className="my-20">
              <input type="radio" name="read_mode" key="1" id="read-whole-file"
                value={ READ_MODE.whole }
                checked={ this.state.readingMode === READ_MODE.whole ? true : false }
                onChange={ this.handleReadingModeChange }
              />
              <label htmlFor="read-whole-file">Read whole file</label>
            </div>
            <div className="my-20">
              <input type="radio" name="read_mode" key="2" id="read-by-key"
                value={ READ_MODE.streaming }
                checked={ this.state.readingMode === READ_MODE.streaming }
                onChange={ this.handleReadingModeChange }
              />
              <label htmlFor="read-by-key">Read by key</label>
            </div>
          </div>
          <div className="">
            <select className="App-primary-keys display-block my-20" disabled={this.state.readingMode === READ_MODE.whole ? true : false}
              value={this.state.selectedKey}
              onChange={this.handleSelectKey}
            >
              <option key={-1} disabled>-select a primary key-</option>
              {
                this.state.primaryKeys.map((key, i) =>
                  (<option key={i} value={key.value}>{key.name}</option>)
                )
              }
            </select>
            <button className="App-read"
              onClick={this.handleOnClick}
            >Read Now</button>
          </div>
        </div>
        <Logger content={this.state.logContent} />
      </div>
      </>
    );
  }
}

export default App;
