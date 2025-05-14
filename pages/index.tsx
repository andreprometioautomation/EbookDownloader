import { useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  useToast,
  Image
} from '@chakra-ui/react';
import React from 'react';

export default function Home() {
  const [asin, setAsin] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const toast = useToast();

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', { method: 'POST' });
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
        description: "Failed to login",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCaptureAll = async () => {
    try {
      // Captura ASIN
      const captureRes = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asin }),
      });
      const captureData = await captureRes.json();
      if (!captureRes.ok) throw new Error(captureData.message);

      // Crea PDF
      const pdfRes = await fetch('/api/createPdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asin }),
      });
      const pdfData = await pdfRes.json();
      if (!pdfRes.ok) throw new Error(pdfData.message);

      toast({
        title: "Capture and PDF created!",
        description: "All tasks completed successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

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
    <Box
      bg="white"
      border="4px solid transparent"
      borderRadius="xl"
      p={6}
      maxW="300px"
      mx="auto"
      height={'90vh'}
      mt={10}
      boxShadow="lg"
      bgImage="url('/1034.png')" // reemplaza con el path correcto
      bgRepeat="no-repeat"
      bgSize="contain"
    >
      <VStack spacing={4}>
        <Text fontSize="2xl" fontWeight="bold" color="black">
          Amazon Kindle Capture
        </Text>

        {!isLogged ? (
          <Button onClick={handleLogin} colorScheme="black" width="full">
            Log in to Kindle Library
          </Button>
        ) : (
          <>
            <Input
              placeholder="Enter ASIN"
              value={asin}
              onChange={(e) => setAsin(e.target.value)}
              borderColor="blackAlpha.300"
              focusBorderColor="purple.500"
            />
            <Button
              onClick={handleCaptureAll}
              bgGradient="linear(to-r, gray.500, gray.700)"
              color="white"
              _hover={{ bg: "gray.600" }}
              width="full"
            >
              Capture
            </Button>
          </>
        )}
      </VStack>
    </Box>
  );
}
