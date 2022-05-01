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
  FormLabel,
  Button,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';

export const App = () => {
  function validateUrl(value: string) {
    let error;
    if (!value) {
      error = 'URL is required';
    } else if (!value.startsWith('http') && !value.endsWith('.com')) {
      error = 'Not a URL';
    }
    return error;
  }

  let isLoading = true;

  async function scrapeRecipes(query: string) {
    const endpoint = `127.0.0.1:8000/scrape?url=${query}`;
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      console.log(data);
    } catch (e) {
      alert('An error occured!');
    }
    isLoading = false;
  }

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign='center' fontSize='xl'>
        <Grid minH='100vh' p={3}>
          <VStack spacing={8} p={100}>
            <Text fontSize='6xl'>🌱 Green Recipes 🍜</Text>
            <Formik
              initialValues={{
                url: 'https://www.foodnetwork.com/recipes/bulgogi-korean-barbecued-beef-recipe-1925970',
              }}
              onSubmit={(values) => {
                scrapeRecipes(values.url);
              }}
            >
              {(props) => (
                <Form>
                  <Field name='url' validate={validateUrl}>
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={form.errors.url && form.touched.url}
                      >
                        <FormLabel htmlFor='url'>Recipe URL</FormLabel>
                        <Input {...field} id='url' placeholder='url' />
                        <FormErrorMessage>{form.errors.url}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Button
                    mt={4}
                    colorScheme='teal'
                    isLoading={props.isSubmitting}
                    type='submit'
                  >
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};
