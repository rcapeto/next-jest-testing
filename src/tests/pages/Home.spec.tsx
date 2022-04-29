import { render, screen } from '@testing-library/react';
import Home from '../../pages';

jest.mock('next/router');
jest.mock('next-auth/client', () => {
   return {
      useSession: () => [null, false]
   }
});

describe('Home Page', () => {
   it('Renders correcty', () => {
      render(
         <Home product={{ amount: 'R$10,00', priceId: 'fake-price-id'}}/>
      );

      expect(screen.getByText('for R$10,00 month')).toBeInTheDocument();
   });
});