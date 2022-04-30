import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

import { stripe } from '../../services/stripe';
import Home, { getStaticProps } from '../../pages';

jest.mock('next/router');
jest.mock('next-auth/client', () => {
   return {
      useSession: () => [null, false]
   }
});

jest.mock('../../services/stripe.ts');

describe('Home Page', () => {
   it('Renders correcty', () => {
      render(
         <Home product={{ amount: 'R$10,00', priceId: 'fake-price-id' }}/>
      );

      expect(screen.getByText('for R$10,00 month')).toBeInTheDocument();
   });

   it('loads initial page', async () => {
      const retriveStripePricesMocked = mocked(stripe.prices.retrieve);

      //promise => mockResolvedValueOnce
      retriveStripePricesMocked.mockResolvedValueOnce({
         id: 'fake-price-id',
         unit_amount: 1000,
      } as any);

      render(
         <Home product={{ amount: 'R$10,00', priceId: 'fake-price-id' }}/>
      );

      const response = await getStaticProps({});

      expect(response).toEqual(
         expect.objectContaining({
            "props": {
               "product": { "amount": "$10.00", "priceId": "fake-price-id" }
            }
         })
      );
   });
});