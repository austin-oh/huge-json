import React, { Component } from 'react';
import './App.css';
import Logger from './components/Logger/Logger';
import { readJSONStream } from './utils/JsonStream'


const { ipcRenderer } = window.require('electron');
const fs = window.require('fs');

class App extends Component {

  // const path =  'src/assets/1.json';
  // const data = fs.readFileSync(path, 'utf-8');
  // if (!data) {
  //   console.log('Error while reading file!');
  // }
  // console.log(data);

  constructor(props) {
    super(props)
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleSelectKey = this.handleSelectKey.bind(this);

    this.state = {
      primaryKeys: [
        { name: 'Header', value: 'header' },
        { name: 'Events', value: 'events' },
        { name: 'Timelines', value: 'timeline' }
      ],
      selectedKey: 'header',
      logContent: '',
      readData: {}
    }
  }

  handleOnClick() {
    let log = `[Reading File] starting with key: ${this.state.selectedKey}`
    this.addLog(log);
    // ipcRenderer.send('CATCH_ON_MAIN', { test: 'Ok' });
    const path = "src/assets/huge.json";
    const key = this.state.selectedKey;
    readJSONStream(path, key)
      .then(result => {
        this.setState({ readData: result.data });

        log = `[Reading File] finished in ${parseFloat(result.executeTime / 1000)}s`; this.addLog(log);
        // results
        const isArray = Array.isArray(result.data);
        const count = isArray ? result.data.length : Object.keys(result.data).length;
        const unit = isArray ? 'children' : 'keys';
        
        log = `[Result] contains ${count} ${unit}.`; this.addLog(log);
      })
      .catch(error => {
        console.log(error);
      });
  }

  addLog(log) {
    this.setState({ logContent: this.state.logContent + '\n' + log });
  }

  handleSelectKey(e) {
    this.setState({ selectedKey: e.target.value });
  }


  render() {
    return (
      <div className="App">
        <div className="flex-container">
          <select className="App-primary-keys"
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

        <Logger content={this.state.logContent}/>
      </div>
    );
  }
}

export default App;
