import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import Link from "next/link";
import { FiCalendar, FiUser } from "react-icons/fi";

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
    <div gap={0} flexDirection="column">
      <Link href={`/post/${data.uid}`}>
        <div color="brand.heading" fontWeight="bold" fontSize="28px">
          {content.title}
        </div>
      </Link>
      <div color="brand.body" gap={3}>
        <div fontSize="18px">{content.subtitle}</div>
        <div color="brand.body" fontSize="14px" gap={3}>
          <div align="center" gap={1}>
            <div as={FiCalendar} boxSize={4} />
            {format(new Date(data.first_publication_date), "d LLL y", {
              locale: ptBR,
            })}
          </div>
          <div align="center" gap={1}>
            <div as={FiUser} boxSize={4} />
            {content.author}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
