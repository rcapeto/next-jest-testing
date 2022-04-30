import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/client';
import { mocked } from 'ts-jest/utils';
import { useRouter } from 'next/router';

import { getPrismicClient } from '../../services/prismic';
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';

jest.mock('../../services/prismic.ts');
jest.mock('next-auth/client');
jest.mock('next/router');

const post = { 
   content: '<p>Post content</p>', 
   slug: 'my-new-post', 
   title: 'My new post', 
   updatedAt: '04-01-2021' 
}

describe('Posts Page', () => {
   it('Renders correcty', () => {
      const useSessionMocked = mocked(useSession);
      useSessionMocked.mockReturnValueOnce([null, false]);

      render(<Post post={post}/>);

      expect(screen.getByText('My new post')).toBeInTheDocument();
      expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
   });

   it('redirects user to full post when user is subscribed', async () => {
      const useSessionMocked = mocked(useSession);
      const useRouterMocked = mocked(useRouter);

      useSessionMocked.mockReturnValueOnce([
         { activeSubscription: 'fake-active-subscription' }, 
         false
      ] as any);

      const pushMock = jest.fn();

      useRouterMocked.mockReturnValueOnce({
         push: pushMock,
      } as any);

      render(<Post post={post}/>);

      expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post');
   });

   it('loads initial data', async () => {
      const getPrismicClientMocked = mocked(getPrismicClient);

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

      const response = await getStaticProps({
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