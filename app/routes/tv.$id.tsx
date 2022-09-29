import {Box, Container, Image, Stack, Text, useColorModeValue} from '@chakra-ui/react';
import type {LoaderArgs} from '@remix-run/node';
import {json} from '@remix-run/node';
import {useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {Tmdb} from '~/api';
import {posterUrl} from '~/lib/tmdb';

export async function loader({params}: LoaderArgs) {
  const {id} = params;
  invariant(id, 'id is required');

  const movie = await Tmdb.tvDetails(id);
  return json(movie);
}

export default function TvPage() {
  const tv = useLoaderData<typeof loader>();
  return (
    <Container p="2">
      <Box
        transition={'all .3s ease'}
        cursor={'pointer'}
        _hover={{
          filter: 'brightness(1.2)'
        }}
        shadow="2xl"
        maxW="3xs"
        bg={useColorModeValue('white', 'gray.800')}
        borderWidth="1px"
        rounded="lg"
      >
        <Image roundedTop="lg" src={posterUrl(tv.poster_path, 'w342')} alt={tv.name} />
        <Box p={2}>
          <Text as="h6">{tv.name}</Text>
        </Box>
      </Box>
    </Container>
  );
}
