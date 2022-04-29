import { render, screen } from '@testing-library/react';

import { Header } from '.';

//1. nome do import 2. função do que retorna nessa importação
jest.mock('next/router', () => {
   return {
      useRouter() {
         return {
            asPath: '/'
         }
      }
   }
});

jest.mock('next-auth/client', () => {
   return {
      useSession() {
         return [null, false];
      }
   }
});

describe('Header Component', () => {
   it('renders correctly', () => {
      render(<Header />);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Posts')).toBeInTheDocument();
   });
});