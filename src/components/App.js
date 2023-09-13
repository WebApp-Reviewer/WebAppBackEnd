import React, { useState, useEffect } from 'react';
// getAPIHealth is defined in our services directory index.js
// you can think of that directory as a collection of api adapters
// where each adapter fetches specific info from our express server's /api route
import { getAPIHealth } from '../services';
import '../style/App.css';

const App = () => {
  const [APIHealth, setAPIHealth] = useState('');

  useEffect(() => {
    // Follow this pattern inside your useEffect calls:
      // First, create an async function that will wrap your AJAX service adapter.
      // Invoke the adapter, await the response, and set the data
    const getAPIStatus = async () => {
      const { healthy } = await getAPIHealth();
      setAPIHealth(healthy ? 'api is up! :D' : 'api is down :/');
    };

    // Second, after you've defined your getter above,
    // Invoke it immediately after its declaration, inside the useEffect callback
    getAPIStatus();


    // Alternatively, you may use an async IIFE (Immediately Invoked Function Expression) to accomplish the same end:
    /*
    (async () => {
      const { healthy } = await getAPIHealth();
      setAPIHealth(healthy ? 'api is up! :D' : 'api is down :/');
    })();
    */
  }, []);

  return (
    <div className="app-container">
      <h1>Hello, World!</h1>
      <p>API Status: {APIHealth}</p>
    </div>
  );
};

export default App;
