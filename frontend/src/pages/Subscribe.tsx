import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Text,
  VStack,
  Link,
  Center,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import { useToast } from '@chakra-ui/react';
import Navbar from '../components/navbar';

function Subscribe() {
  // validate us phone number
  function validatePhone(value: string) {
    let error;
    if (!value) {
      error = 'Phone number is required';
    } else if (value.length !== 10) {
      error = 'Phone number must be 10 digits';
    }
    return error;
  }

  async function subscribe(Phone: string) {
    const endpoint = `https://recipeapi-kg5pwkenoq-uc.a.run.app/subscribe?phone=${Phone}`;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
      });

      const data = await res.json();
      console.log(data);
    } catch (e) {
      alert(e);
    }
  }

  const toast = useToast();

  return (
    <>
      <Navbar />
      <VStack textAlign='center'>
        <Text mt={100} fontSize={{ base: 'md', sm: '2xl', md: '8xl' }}>
          Subscribe for daily updates
        </Text>
        <Text fontSize={{ base: 'xs', sm: 'md', md: '2xl' }}>
          Every day, we'll send you green recipes so that your every meal is
          environmentally friendly
        </Text>
        <Formik
          initialValues={{
            phonenum: '1234567890',
          }}
          onSubmit={(values, actions) => {
            subscribe(values.phonenum);
            actions.setSubmitting(false);
          }}
        >
          {(props) => (
            <Form style={{ width: '50%', margin: '4rem' }}>
              <Field name='phonenum' validate={validatePhone}>
                {({ field, form }: any) => (
                  <FormControl
                    isInvalid={form.errors.phonenum && form.touched.phonenum}
                  >
                    <FormLabel htmlFor='phonenum'>Phone Number</FormLabel>
                    <Input {...field} id='phonenum' placeholder='phonenum' />
                    <FormErrorMessage>{form.errors.phonenum}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button
                mt={10}
                colorScheme='teal'
                isLoading={props.isSubmitting}
                type='submit'
                size='lg'
                onClick={() =>
                  toast({
                    title: 'Subscribed.',
                    description: "We've added you to your list :)",
                    status: 'success',
                    duration: 10000,
                    isClosable: true,
                  })
                }
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </VStack>
    </>
  );
}

export default Subscribe;
