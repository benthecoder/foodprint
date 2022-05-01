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
  Flex,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';

import { useState } from 'react';
import { NavigationType } from 'react-router-dom';
import Navbar from './components/navbar';

export const App = () => {
  const [recipe, setRecipe] = useState({});
  const [title, setTitle] = useState('');
  const [submit, setSubmit] = useState(false);

  const computeSum = (recipe) => {
    let emission = 0;
    let land_use = 0;
    let water_use = 0;
    Object.keys(recipe).map((keys) => (emission += recipe[keys].emission));
    Object.keys(recipe).map((keys) => (land_use += recipe[keys].land_use));
    Object.keys(recipe).map((keys) => (water_use += recipe[keys].water_use));

    return [emission.toFixed(2), land_use.toFixed(2), water_use.toFixed(2)];
  };

  const renderResults = (keys, recipe) => {
    return (
      <VStack>
        <Text as='kbd'>{keys} (per kg)</Text>
        <HStack spacing={5}>
          <Text>{recipe.emission} kgCO₂eq</Text>
          <Text color='grey.500'>|</Text>
          <Text>{recipe.land_use} m²</Text>
          <Text color='grey.500'>|</Text>
          <Text>{recipe.water_use} liters</Text>
        </HStack>
      </VStack>
    );
  };

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
            <VStack spacing={10} bg='black' borderRadius='3rem' p={10}>
              <Text fontSize='3xl' as='u'>
                {title}
              </Text>
              {Object.keys(recipe).map((keys) =>
                renderResults(keys, recipe[keys])
              )}
              <Box>
                <Text>
                  Total Emission{' '}
                  <Text
                    as={'span'}
                    color={
                      computeSum(recipe)[0] > 100 ? 'red.400' : 'green.400'
                    }
                  >
                    {computeSum(recipe)[0]}
                  </Text>{' '}
                  kgCO₂eq
                </Text>
                <Text>
                  Total land use{' '}
                  <Text
                    as={'span'}
                    color={
                      computeSum(recipe)[1] > 300 ? 'red.400' : 'green.400'
                    }
                  >
                    {computeSum(recipe)[1]}
                  </Text>{' '}
                  m²
                </Text>
                <Text>
                  Total water use{' '}
                  <Text
                    as={'span'}
                    color={
                      computeSum(recipe)[2] > 3700 ? 'red.400' : 'green.400'
                    }
                  >
                    {computeSum(recipe)[2]}
                  </Text>{' '}
                  liters
                </Text>
              </Box>
            </VStack>
          ) : (
            submit && <Text>No matching ingredients found :(</Text>
          )}
        </VStack>
      </Box>
    </>
  );
};
