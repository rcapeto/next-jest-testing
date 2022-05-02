import { render, screen, waitFor } from '@testing-library/react';

import { Async } from '.';

// Método Asincrono, para componentes se apareceu em tela

describe('Async Component', () => {
   it('renders correctly', async () => {
      render(
         <Async/>
      );

      expect(screen.getByText('Hello World')).toBeInTheDocument();

      //Vai demorar 1s para rodar os testes, porque no timeout está com 1s.
      // 1a opção => expect(await screen.findByText('Button')).toBeInTheDocument();

      await waitFor(() => expect(screen.getByText('Button')).toBeInTheDocument());
   });
});