import { Box, Flex, Icon, Image, Text } from '@chakra-ui/react';
import { format, minutesToHours } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import ptBR from 'date-fns/locale/pt-BR';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

interface Content {
  heading: string;
  body: {
    text: string;
  }[];
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  function calculateReadingTime(content: Content[]): string {
    const getHeadingWordsPerMinutes = content.reduce((acc, currentValue) => {
      return currentValue.heading.split(/\s+/).length + acc;
    }, 0);

    const getBodyWordsPerMinutes = content.reduce((acc, currentValue) => {
      return RichText.asText(currentValue.body).split(/\s+/).length + acc;
    }, 0);

    const getWordsPerMinutes = Math.ceil(
      (getHeadingWordsPerMinutes + getBodyWordsPerMinutes) / 200
    );

    if (getWordsPerMinutes < 1) {
      return 'Rápida leitura';
    }

    if (getWordsPerMinutes < 60) {
      return `${getWordsPerMinutes} min`;
    }

    return `${minutesToHours(getWordsPerMinutes)} horas`;
  }

  if (router.isFallback) {
    return (
      <>
        <Box color="brand.body">
          <Box as="span">Carregando...</Box>
        </Box>
      </>
    );
  }

  return (
    <Box color="brand.body" pb="5em">
      <Head>
        <title>{post.data.title} | Spacetraveling</title>
      </Head>
      <Box>
        {post.data.banner && (
          <Image
            className={styles.banner}
            src={post.data.banner.url}
            alt="banner"
            w="100%"
            height={400}
            objectFit="cover"
          />
        )}
      </Box>
      <Box maxWidth={1280} p={5} margin="auto">
        <Text fontSize="48px" fontWeight="bold" color="brand.heading">
          {post.data.title}
        </Text>
        <Flex gap={2} className={styles.postInfo} mb={8}>
          <Flex gap={1} alignItems="center">
            <Icon as={FiCalendar} boxSize={4} />
            {format(new Date(post.first_publication_date), 'd LLL y', {
              locale: ptBR,
            })}
          </Flex>
          <Flex gap={1} alignItems="center">
            <Icon as={FiUser} boxSize={4} />
            {post.data.author}
          </Flex>
          <Flex gap={1} alignItems="center">
            <Icon as={FiClock} boxSize={4} />
            {calculateReadingTime(post.data.content)}
          </Flex>
        </Flex>
        <Box>
          {post.data.content.map(content => (
            <Box key={content.heading}>
              <Text
                fontSize="36px"
                fontWeight="bold"
                color="brand.heading"
                mb={5}
              >
                {content.heading}
              </Text>
              <Box
                fontSize="18px"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(content.body),
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  const params = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    paths: params,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', slug as string, {});
  const postData = {
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url ?? '',
      },
      author: response.data.author,
      content: response.data.content.map(content => ({
        heading: content.heading,
        body: content.body,
      })),
    },
    uid: response.uid,
    first_publication_date: response.first_publication_date,
  } as Post;

  return {
    props: {
      post: postData,
    },
    revalidate: 60 * 60 * 24,
  };
};
