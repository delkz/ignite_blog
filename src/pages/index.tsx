import { GetStaticProps } from 'next';
import { Button, Flex, Icon, Link, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { PrismicDocument } from '@prismicio/types';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Head from 'next/head';
import { getPrismicClient } from '../services/prismic';

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
      <Head>
        <title>Posts | Spacetraveling</title>
      </Head>
      {posts.map(post => {
        return (
          <Flex key={post.uid} gap={0} flexDirection="column">
            <Text color="brand.heading" fontWeight="bold" fontSize="28px">
              <Link href={`/post/${post.uid}`}>{post.data.title}</Link>
            </Text>

            <Stack color="brand.body" gap={3}>
              <Text fontSize="18px">{post.data.subtitle}</Text>
              <Flex color="brand.body" fontSize="14px" gap={3}>
                <Flex align="center" gap={1}>
                  <Icon as={FiCalendar} boxSize={4} />
                  {format(new Date(post.first_publication_date), 'd LLL y', {
                    locale: ptBR,
                  })}
                </Flex>
                <Flex align="center" gap={1}>
                  <Icon as={FiUser} boxSize={4} />
                  {post.data.author}
                </Flex>
              </Flex>
            </Stack>
          </Flex>
        );
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
