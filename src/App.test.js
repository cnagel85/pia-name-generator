import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App, { Create, Name } from './App';

test('renders learn react link', () => {
  render(
    <BrowserRouter>
      <Create />
    </BrowserRouter>
  );
  const linkElement = screen.getByText(/Name me!/i);
  expect(linkElement).toBeInTheDocument();
});
