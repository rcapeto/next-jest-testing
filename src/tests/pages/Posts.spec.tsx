import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

import { getPrismicClient } from '../../services/prismic';
import Posts, { getStaticProps } from '../../pages/posts';

jest.mock('../../services/prismic.ts');

const posts = [
   { 
      excerpt: 'Post excerpt', 
      slug: 'my-new-post', 
      title: 'My new post', 
      updatedAt: '04-01-2021' 
   }
];

describe('Posts Page', () => {
   it('Renders correcty', () => {
      render(
         <Posts posts={posts}/>
      );

      expect(screen.getByText('My new post')).toBeInTheDocument();
   });

   it('loads initial page', async () => {
      const getPrismicClientMocked = mocked(getPrismicClient);

      getPrismicClientMocked.mockReturnValueOnce({
         query: jest.fn().mockResolvedValueOnce({
            results: [
               {
                  uid: 'my-new-post',
                  data: {
                     title: [
                        { type: 'heading', text: 'My new post'}
                     ],
                     content: [
                        { type: 'paragraph', text: 'Post excerpt'}
                     ]
                  },
                  last_publication_date: '04-01-2021'
               }
            ]
         })
      } as any);

      const response = await getStaticProps({});
      
      expect(response).toEqual(
         expect.objectContaining({
            props: {
               posts: [
                  {
                     excerpt: 'Post excerpt', 
                     slug: 'my-new-post', 
                     title: 'My new post', 
                     updatedAt: '01 de abril de 2021'
                  }
               ]
            }
         }),
      );
   });
});