import React from 'react';
import {render, screen} from '@testing-library/react';
import App from './App';
// import { ReactDOMTestUtils } from 'react-dom/test-utils';

import { act } from "react";

describe('simple', () => {
  it('renders learn react link', () => {
    act(() => {
      render(<App />);
    })
  
    const linkElement = screen.getByText(/learn react/i);
    // @ts-ignore
    expect(linkElement).toBeInTheDocument();
  });
})