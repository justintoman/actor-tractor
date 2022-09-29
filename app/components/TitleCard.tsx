import {Box, Image, Text, useColorModeValue} from '@chakra-ui/react';
import {Link} from '@remix-run/react';
import {posterUrl} from '~/lib/tmdb';
import dayjs from 'dayjs';

interface TitleCardProps {
  type: 'tv' | 'movie'; // | 'anime';
  titleId: number;
  posterPath: string | undefined;
  title: string;
  date: string;
}

export function TitleCard({date, type, titleId, posterPath, title}: TitleCardProps) {
  return (
    <Box
      transition={'all .3s ease'}
      cursor={'pointer'}
      _hover={{
        animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        filter: 'brightness(1.2)'
      }}
      shadow="2xl"
      maxW="3xs"
      bg={useColorModeValue('white', 'gray.800')}
      borderWidth="1px"
      rounded="lg"
    >
      <Link to={`/${type}/${titleId}`}>
        <Image roundedTop="lg" src={posterUrl(posterPath, 'w342')} alt={title} />
        <Box p={2}>
          <Text fontSize="1.2em" fontWeight="light">
            {title}
          </Text>
          <Text fontSize="sm">{dayjs(date).format('MMM DD, YYYY')}</Text>
        </Box>
      </Link>
    </Box>
  );
}
