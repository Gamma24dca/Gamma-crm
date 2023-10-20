import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it } from 'vitest';
import { App } from '../App/App';

describe('Not Found page', () => {
  it('renders not found page if path is invalid', () => {
    render(
      <MemoryRouter initialEntries={['/invalidRoute']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading')).toHaveTextContent('Not found');
  });
});
