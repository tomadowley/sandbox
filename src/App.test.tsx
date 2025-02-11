import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import App from './App';

describe('Learn React', () => {
  it('renders learn react link', () => {
    // Arrange
    act(() => {
      render(<App />);
    });

    // Assert
    act(() => {
      expect(false).toBe(true);
    });
  });
});
