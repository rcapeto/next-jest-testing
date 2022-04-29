import { render } from '@testing-library/react';

import { ActiveLink } from '.';

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

describe('ActiveLink Component', () => {
   //test ou it
   it('renders correctly', () => {
      const { getByText } = render(
         <ActiveLink href="/" activeClassName='active'>
            <a>Home</a>
         </ActiveLink>
      );
      //estar renderizando o texto home
      expect(getByText('Home')).toBeInTheDocument();
   });
   
   it('Adds active class if the href is the same the asPath', () => {
      const { getByText } = render(
         <ActiveLink href="/" activeClassName='active'>
            <a>Home</a>
         </ActiveLink>
      );
   
      expect(getByText('Home')).toHaveClass('active');
   });
});

