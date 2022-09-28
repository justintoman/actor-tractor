import {Button, Container, List, ListItem, useColorMode} from '@chakra-ui/react';

export default function Index() {
  const {colorMode, toggleColorMode} = useColorMode();
  return (
    <Container style={{fontFamily: 'system-ui, sans-serif', lineHeight: '1.4'}}>
      <h1>Welcome to Remix</h1>
      <List>
        <ListItem>
          <a target="_blank" href="https://remix.run/tutorials/blog" rel="noreferrer">
            15m Quickstart Blog Tutorial
          </a>
        </ListItem>
        <ListItem>
          <a target="_blank" href="https://remix.run/tutorials/jokes" rel="noreferrer">
            Deep Dive Jokes App Tutorial
          </a>
        </ListItem>
        <ListItem>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </ListItem>
        <ListItem>
          <Button bgColor="purple.600" onClick={toggleColorMode}>
            Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
          </Button>
        </ListItem>
      </List>
    </Container>
  );
}
