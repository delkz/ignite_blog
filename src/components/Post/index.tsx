import { Flex, Stack, Text, Icon, Link } from '@chakra-ui/react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
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
interface PostProps {
  data: Post;
}
const Post = ({ data }: PostProps): JSX.Element => {
  const content = data.data;
  return (
    <Link href={`/post/${data.uid}`}>
      <Flex gap={0} flexDirection="column">
        <Text color="brand.heading" fontWeight="bold" fontSize="28px">
          {content.title}
        </Text>

        <Stack color="brand.body" gap={3}>
          <Text fontSize="18px">{content.subtitle}</Text>
          <Flex color="brand.body" fontSize="14px" gap={3}>
            <Flex align="center" gap={1}>
              <Icon as={FiCalendar} boxSize={4} />
              {format(new Date(data.first_publication_date), 'd LLL y', {
                locale: ptBR,
              })}
            </Flex>
            <Flex align="center" gap={1}>
              <Icon as={FiUser} boxSize={4} />
              {content.author}
            </Flex>
          </Flex>
        </Stack>
      </Flex>
    </Link>
  );
};

export default Post;
