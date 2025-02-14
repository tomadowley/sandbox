import React from 'react';
import {render, screen} from '@testing-library/react';
import App from './App';
import ReactDOMTestUtils from 'react-dom/test-utils';



describe('simple', () => {
  it('renders learn react link', () => {
    ReactDOMTestUtils.act(() => {
      render(<App />);
    })
  
    const linkElement = screen.getByText(/learn react/i);
    // @ts-ignore
    expect(linkElement).toBeInTheDocument();
  });
})