import { GetStaticProps } from "next";
import { Box, Button, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import te from "date-fns/esm/locale/te/index.js";
import PostElement from "../components/Post";
import { getPrismicClient } from "../services/prismic";

import commonStyles from "../styles/common.module.scss";
import styles from "./home.module.scss";

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

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState(postsPagination);

  const handleLoadMorePosts = (): void => {
    if (postsPagination.next_page != null) {
      fetch(postsPagination.next_page)
        .then((response) => {
          return response.text();
        })
        .then((data) => {
          const newData: PostPagination = JSON.parse(data);

          const tempPostsPagination = {
            ...postsPagination,
            next_page: newData.next_page,
            prev_page: newData.prev_page,
            page: newData.page,
            results: [...postsPagination.results, ...newData.results],
          };

          setPosts(tempPostsPagination);
        });
    }
  };

  return (
    <Stack gap="48px" alignItems="baseline">
      {posts.results.map((post) => {
        return <PostElement key={post.uid} data={post} />;
      })}
      {posts.next_page && (
        <Button
          onClick={() => {
            handleLoadMorePosts();
          }}
          color="brand.highlight"
          fontWeight="bold"
          marginRight="auto"
          marginLeft="0"
        >
          Carregar mais posts
        </Button>
      )}
    </Stack>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType("posts", {
    pageSize: 5,
  });

  return {
    props: {
      postsPagination: postsResponse,
    },
  };
};
