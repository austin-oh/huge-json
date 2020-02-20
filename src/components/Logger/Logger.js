import React, { Component } from 'react';
import styles from './Logger.module.css';

class Logger extends Component {

    constructor(props) {
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    handleOnChange(e) {
    }

    render() {
        return (
            <div className={styles.container}>
                <h3>Logs</h3>
                <textarea className={styles.logBox}
                    value={this.props.content}
                    onChange={this.handleOnChange}
                    >
                </textarea>
            </div>
        );
    }
}

export default Logger;