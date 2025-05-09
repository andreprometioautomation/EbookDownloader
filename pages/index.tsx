import { useState } from 'react';
import { Box, Button, Input, VStack, Text, useToast } from '@chakra-ui/react';
import React from 'react';

export default function Home() {
  const [asin, setAsin] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const toast = useToast();

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
      });

      const result = await response.json();
      if (response.ok) {
        setIsLogged(true);
        toast({
          title: "Login successful",
          description: result.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
     
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCapture = async () => {
    try {
      const response = await fetch('/api/capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ asin }),
      });

      const result = await response.json();
      if (response.ok) {
        toast({
          title: "Capture successful",
          description: result.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
   
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCreatePDF = async () => {
    try {
      const response = await fetch('/api/createPdf', {
        method: 'POST',
      });

      const result = await response.json();
      if (response.ok) {
        toast({
          title: "PDF created successfully",
          description: result.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
      
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} p={5}>
      <Text fontSize="xl">Amazon Kindle Capture</Text>
      {!isLogged ? (
        <Button onClick={handleLogin} colorScheme="teal">
          Log in to Kindle Library
        </Button>
      ) : (
        <Box>
          <Input
            placeholder="Enter ASIN"
            value={asin}
            onChange={(e) => setAsin(e.target.value)}
            mb={3}
          />
          <Button onClick={handleCapture} colorScheme="teal" mb={3}>
            Start Capture
          </Button>
          <Button onClick={handleCreatePDF} colorScheme="purple">
            Create PDF
          </Button>
        </Box>
      )}
    </VStack>
  );
}