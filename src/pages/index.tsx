import { GetStaticProps } from 'next';
import { Box, Button, Stack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import te from 'date-fns/esm/locale/te/index.js';
import PostElement from '../components/Post';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { PrismicDocument } from '@prismicio/types';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  prev_page?: string;
  page?: number;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}
function parseResult(
  result: PrismicDocument<Record<string, any>, string, string>[]
): Post[] {
  const posts: Post[] = result.map(({ data, uid, first_publication_date }) => ({
    data: {
      author: data.author,
      subtitle: data.subtitle,
      title: data.title,
    },
    first_publication_date,
    uid,
  }));

  return posts;
}
export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState(postsPagination?.results ?? []);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  const handleLoadMorePosts = (): void => {
    if (postsPagination.next_page != null) {
      fetch(postsPagination.next_page)
        .then(result => result.json())
        .then(data => {
          setPosts([...posts, ...parseResult(data.results)]);
          setNextPage(data.next_page);
          setLoadingMore(false);
        });
    }
  };

  return (
    <Stack gap="48px" alignItems="baseline">
      {posts.map(post => {
        return <PostElement key={post.uid} data={post} />;
      })}
      {nextPage && (
        <Button
          onClick={() => {
            handleLoadMorePosts();
          }}
          color="brand.highlight"
          fontWeight="bold"
          marginRight="auto"
          marginLeft="0"
          variant="link"
        >
          Carregar mais posts
        </Button>
      )}
    </Stack>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType(`posts`, {
    pageSize: 5,
  });

  return {
    props: {
      postsPagination: postsResponse,
    },
  };
};
