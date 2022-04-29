import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/client';
import { mocked } from 'ts-jest/utils';

import { SignInButton } from '.';

//1. nome do import 2. função do que retorna nessa importação
//Dessa maneira porque cada um dos testes precisa ser dados diferentes.
jest.mock('next-auth/client');

describe('SignInButton Component', () => {
   //test ou it
   it('renders correctly when user is not signed', () => {
      const useSessionMocked = mocked(useSession);
      //mocar apenas esse teste com esse valor.
      useSessionMocked.mockReturnValueOnce([null, false]);

      render(<SignInButton />);
      expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
   });

   it('renders correctly when user signed', () => {
      const useSessionMocked = mocked(useSession);
      useSessionMocked.mockReturnValueOnce(
         [
            { 
               user: { 
                  name: 'John Doe', 
                  email: 'johndoe@example.com' 
               },    
               expires: 'fake expires' 
            }, 
            true
         ]
      );

      render(<SignInButton />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
   });
});

