import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import Head from 'next/head'
import {reloadAsHTTPSInProduction} from '../helpers/reloadAsHTTPSInProduction';
import {usePlainFetching, postJSON} from '../helpers/fetching'
import styles from './Layout.module.css'


export default function Layout({children}) {
  useEffect(reloadAsHTTPSInProduction, []);  
  return (
    <div className="App">
      <Head>
        <title>scribble</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WithPlayerName>
        {children}
      </WithPlayerName>
    </div>
  );
}
Layout.propTypes = {
  children: PropTypes.node.isRequired
};


function WithPlayerName({children}) {
  const {data, error, isValidating, mutate} = usePlainFetching('/api/player');
  const playerName = (data && data.name);

  return (playerName || isValidating && !error)
    ? children
    : <PickName onDone={mutate} />;
}
WithPlayerName.propTypes = {
  children: PropTypes.node.isRequired
};


class PickName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    e.preventDefault();
    this.setState({name: e.target.value});
  }

  onSubmit(e) {
    e.preventDefault();

    const {name} = this.state;
    const {onDone} = this.props;
    postJSON('/api/players/name', {
      body: JSON.stringify({name})
    }).then(onDone);
  }

  render() {
    const {name} = this.state;
    return (
      <div className={styles.pickName}>
        <form onSubmit={this.onSubmit}>
          <div>hi!  what do folks call you?</div>
          <input type="text" placeholder="M. Webster" value={name} onChange={this.onChange} />
          <button type="submit">Next</button>
        </form>
      </div>
    );
  }
}
PickName.propTypes = {
  onDone: PropTypes.func.isRequired
};
