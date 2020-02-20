import React, { Component } from 'react';
import styles from './Loading.module.css';

class Loading extends Component {

    render() {
        const cssDisplay = this.props.loading ? 'flex' : 'none';
        return (
            <div className={styles.container} style={{ display: `${cssDisplay}` }}>
                <p className={styles.loadingText}>Processing...</p>
            </div>
        );
    }
}

export default Loading;