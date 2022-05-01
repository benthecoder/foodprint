import {
  Box,
  Text,
  VStack,
  Input,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Button,
  HStack,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';

import { useState } from 'react';
import Navbar from './components/navbar';

export const App = () => {
  const [recipe, setRecipe] = useState({});
  const [title, setTitle] = useState('');
  const [submit, setSubmit] = useState(false);

  function validateUrl(value) {
    let error;
    if (!value) {
      error = 'URL is required';
    } else if (!value.startsWith('https') && !value.endsWith('.com')) {
      error = 'Not a URL';
    }
    return error;
  }

  async function scrapeRecipes(query) {
    const endpoint = `https://recipeapi-kg5pwkenoq-uc.a.run.app/scrape?url=${query}`;
    try {
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          mode: 'no-cors', // no-cors, *cors, same-origin
        },
      });

      const data = await res.json();
      setTitle(data[0]);
      setRecipe(data[1]);
      console.log(data);
    } catch (e) {
      alert(e);
    }
  }

  return (
    <>
      <Navbar />
      <Box textAlign='center' fontSize='xl'>
        <VStack spacing={8} p={100}>
          <Text fontSize='6xl'>🌱 How Green is the Recipe? 🍜</Text>
          <Formik
            initialValues={{
              url: 'https://www.foodnetwork.com/recipes/bulgogi-korean-barbecued-beef-recipe-1925970',
            }}
            onSubmit={(values, actions) => {
              scrapeRecipes(values.url);
              actions.setSubmitting(false);
              setSubmit(true);
            }}
          >
            {(props) => (
              <Form style={{ width: '80%', margin: '4rem' }}>
                <Field name='url' validate={validateUrl}>
                  {({ field, form }) => (
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
                  mt={10}
                  colorScheme='teal'
                  isLoading={props.isSubmitting}
                  type='submit'
                  size='lg'
                >
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
          {Object.keys(recipe).length !== 0 ? (
            <>
              <Text fontSize='3xl'>{title}</Text>
              {Object.keys(recipe).map((keys) => (
                <Text>{`${recipe[keys].emission} kg of CO2 per kg of ${keys} `}</Text>
              ))}
            </>
          ) : (
            submit && <Text>No matching ingredients found :(</Text>
          )}
        </VStack>
      </Box>
    </>
  );
};
