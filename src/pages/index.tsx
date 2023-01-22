import { GetStaticProps } from 'next';
import { Button, Stack } from '@chakra-ui/react';
import { useState } from 'react';
import { PrismicDocument } from '@prismicio/types';
import Head from 'next/head';
import { getPrismicClient } from '../services/prismic';
import PostCard from '../components/PostCard';

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
    if (nextPage != null) {
      fetch(nextPage)
        .then(result => result.json())
        .then(data => {
          setPosts([...posts, ...parseResult(data.results)]);
          setNextPage(data.next_page);
          setLoadingMore(false);
        });
    }
  };

  return (
    <Stack
      maxWidth={1280}
      p={5}
      margin="auto"
      gap="48px"
      alignItems="baseline"
      pb="5em"
    >
      <Head>
        <title>Posts | Spacetraveling</title>
      </Head>
      {posts.map(post => {
        return <PostCard key={post.uid} post={post} />;
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
    pageSize: 3,
  });

  return {
    props: {
      postsPagination: postsResponse,
    },
  };
};
