import React from 'react';
import ReactDOM from 'react-dom';
import GameOfLife from './components/GameOfLife';
import './styles.css';

const rootEl: HTMLElement = document.getElementById('root');

ReactDOM.render(<GameOfLife />, rootEl);
