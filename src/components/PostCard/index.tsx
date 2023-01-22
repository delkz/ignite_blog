import { Flex, Stack, Icon, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps): JSX.Element => {
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
};

export default PostCard;
