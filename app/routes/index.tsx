import {Button, Container, Flex, Stack, StackDivider, Text, useColorMode} from '@chakra-ui/react';
import {useLoaderData} from '@remix-run/react';
import {json} from '@remix-run/node';
import {Tmdb} from '~/api';
import {TitleCard} from '~/components/TitleCard';

export async function loader() {
  const [tv, movie] = await Promise.all([Tmdb.tvDetails('84773'), Tmdb.movieDetails('766475')]);
  return json({tv, movie});
}

export default function Index() {
  const {colorMode, toggleColorMode} = useColorMode();
  const {tv, movie} = useLoaderData<typeof loader>();
  return (
    <Container maxW="lg">
      <Stack mt={4}>
        <Flex columnGap="4">
          <TitleCard
            titleId={tv.id}
            title={tv.name}
            posterPath={tv.poster_path}
            type="tv"
            date={`${tv.first_air_date}`}
          />
          <TitleCard
            titleId={movie.id}
            title={movie.title}
            posterPath={movie.poster_path}
            type="movie"
            date={`${movie.release_date}`}
          />
        </Flex>
        <StackDivider />
        <Button bgColor="purple.600" onClick={toggleColorMode} w="3xs">
          Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
        </Button>
      </Stack>
    </Container>
  );
}
