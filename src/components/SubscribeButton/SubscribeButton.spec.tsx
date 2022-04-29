import { render, screen, fireEvent } from '@testing-library/react';
import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { mocked } from 'ts-jest/utils';

import { SubscribeButton } from '.';

jest.mock('next/router');
jest.mock('next-auth/client');

describe('SubscribeButton Component', () => {
   it('Renders correctly', () => {
      const useSessionMocked = mocked(useSession);
      useSessionMocked.mockReturnValueOnce([null, false]);

      render(<SubscribeButton />);
      expect(screen.getByText('Subscribe now'));
   });

   it('Redirects user to sign in when not signed', () => {
      const useSessionMocked = mocked(useSession);
      useSessionMocked.mockReturnValueOnce([null, false]);
      
      const signInMocked = mocked(signIn);

      render(<SubscribeButton />);

      const subscribeButton = screen.getByText('Subscribe now');

      fireEvent.click(subscribeButton);

      expect(signInMocked).toHaveBeenCalled();
   });

   it('Redirects to posts when user already as a subscription', () => {
      const useRouterMocked = mocked(useRouter);
      const useSessionMocked = mocked(useSession);

      useSessionMocked.mockReturnValue([
         {
            user: { name: 'John Doe' },
            expires: 'fake-expires',
            activeSubscription: 'fake-active-subscription'
         },
         false
      ]);

      const pushMocked = jest.fn();

      useRouterMocked.mockReturnValueOnce({
         push: pushMocked
      } as any);
      
      render(<SubscribeButton />);

      const subscribeButton = screen.getByText('Subscribe now');

      fireEvent.click(subscribeButton);

      expect(pushMocked).toHaveBeenCalled();
   });
});