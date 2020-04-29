import PropTypes from 'prop-types';
import {useEffect} from 'react';
import Head from 'next/head'
import {reloadAsHTTPSInProduction} from '../helpers/reloadAsHTTPSInProduction';
import {usePlainFetching} from '../helpers/fetching'
import PickName from './PickName';


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


