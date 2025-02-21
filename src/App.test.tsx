import { render, screen } from '@testing-library/react';
import App from './App';
import {act} from 'react-dom/test-utils';
/*
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
*/
test('what home link does', async() => {
// act(()=> {
 await act(async() => {
   render(<App />);
   const home = screen.getByText("Home");
   home.click();
   })
   expect(await screen.findByText(/Welcome to React/)).toBeTruthy();
});

test('what about link does', async() => {
await act(async()=> {
   render(<App />);
   const about = screen.getByText("About");
   act(() => {
          about.click();
   });
   expect(await screen.findByText(/About Docker/)).toBeTruthy();
  });
});