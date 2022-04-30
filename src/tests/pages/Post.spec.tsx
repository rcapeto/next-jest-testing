import { render, screen } from '@testing-library/react';
import { getSession } from 'next-auth/client';
import { mocked } from 'ts-jest/utils';

import { getPrismicClient } from '../../services/prismic';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';

jest.mock('../../services/prismic.ts');
jest.mock('next-auth/client');

const post = { 
   content: '<p>Post content</p>', 
   slug: 'my-new-post', 
   title: 'My new post', 
   updatedAt: '04-01-2021' 
}

describe('Posts Page', () => {
   it('Renders correcty', () => {
      render(
         <Post post={post}/>
      );

      expect(screen.getByText('My new post')).toBeInTheDocument();
   });

   it('redirects user if no subscription is found', async () => {
      const getSessionMocked = mocked(getSession);

      getSessionMocked.mockResolvedValueOnce({
         activeSubscription: null
      } as any);

      const response = await getServerSideProps({
         params: {
            slug: 'my-new-post'
         }
      } as any);
      
      expect(response).toEqual(
         expect.objectContaining({
            redirect: expect.objectContaining({
               destination: '/'
            })
         }),
      );
   });

   it('loads initial data', async () => {
      const getSessionMocked = mocked(getSession);
      const getPrismicClientMocked = mocked(getPrismicClient);

      getSessionMocked.mockResolvedValueOnce({
         activeSubscription: 'fake-active-subscription'
      } as any);

      getPrismicClientMocked.mockReturnValueOnce({
         getByUID: jest.fn().mockResolvedValueOnce({
            data: {
               title: [
                  { type: 'heading', text: 'My new post'}
               ],
               content: [
                  { type: 'paragraph', text: 'Post content'}
               ],
            },
            last_publication_date: '04-01-2021'
         })
      } as any);

      const response = await getServerSideProps({
         params: {
            slug: 'my-new-post'
         }
      } as any);
      
      expect(response).toEqual(
         expect.objectContaining({
            props: {
               post: {
                  content: '<p>Post content</p>', 
                  slug: 'my-new-post', 
                  title: 'My new post', 
                  updatedAt: '01 de abril de 2021' 
               }
            }
         }),
      );
   });
});