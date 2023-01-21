import Link from 'next/link';
import Image from 'next/image';
import { Box } from '@chakra-ui/react';
import common from '../../styles/common.module.scss';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  // TODO
  return (
    <div className={styles.header}>
      <Box maxWidth={1280} p={5} margin="auto">
        <Link href="/">
          <Box cursor="pointer">
            <Image src="/logo.svg" alt="logo" width={240} height={105} />
          </Box>
        </Link>
      </Box>
    </div>
  );
}
