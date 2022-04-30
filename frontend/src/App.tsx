import {
  ChakraProvider,
  Box,
  Text,
  VStack,
  Grid,
  theme,
  Input,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { useState } from 'react';

export const App = () => {
  const [input, setInput] = useState('');
  const handleInputChange = (e: any) => setInput(e.target.value);
  const isError = input === '';

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign='center' fontSize='xl'>
        <Grid minH='100vh' p={3}>
          <ColorModeSwitcher justifySelf='flex-end' />
          <VStack spacing={8} px={100}>
            <Text fontSize='6xl'>🌱 Green Recipes</Text>
            <Text>Insert a recipe url below</Text>
            <FormControl isInvalid={isError}>
              <FormLabel htmlFor='url'>URL</FormLabel>
              <Input
                id='url'
                type='url'
                value={input}
                onChange={handleInputChange}
              />
              {!isError ? (
                <FormHelperText>Enter a reciple url</FormHelperText>
              ) : (
                <FormErrorMessage>url is required.</FormErrorMessage>
              )}
            </FormControl>
            )
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};
