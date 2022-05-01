import { Flex, Spacer, Button } from '@chakra-ui/react';
import { FaRegComments } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  let navigate = useNavigate();
  const routeChange = () => {
    let path = '/subscribe';
    navigate(path);
  };

  const routeHome = () => {
    let path = '/submit';
    navigate(path);
  };

  return (
    <Flex m={5}>
      <Button
        colorScheme='teal'
        size='lg'
        variant='ghost'
        fontWeight='bold'
        onClick={routeHome}
      >
        Home
      </Button>
      <Spacer />
      <Button
        leftIcon={<FaRegComments />}
        colorScheme='teal'
        size='lg'
        variant='ghost'
        fontWeight='bold'
        onClick={routeChange}
      >
        Subscribe to daily recommendations
      </Button>
    </Flex>
  );
}

export default Navbar;
