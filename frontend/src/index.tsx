import * as React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Subscribe from './pages/Subscribe';
import Landing from './pages/Landing';
import theme from './theme';

import { ChakraProvider } from '@chakra-ui/react';

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='submit' element={<App />} />
          <Route path='subscribe' element={<Subscribe />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById('root')
);
