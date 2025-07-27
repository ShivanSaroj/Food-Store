import React from 'react';
import { Box, Container, Text, Flex } from '@chakra-ui/react';
import { useColorModeValue } from './ui/color-mode';

const Footer = () => {
    const bg = useColorModeValue('gray.100', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Box
            bg={bg}
            borderTop="1px solid"
            borderColor={borderColor}
            mt="auto"
            py={6}
        >
            <Container maxW="1200px">
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    justify="center"
                    align="center"
                    textAlign="center"
                >
                    <Text
                        color={textColor}
                        fontSize="sm"
                        fontWeight="medium"
                    >
                        © {new Date().getFullYear()} All rights reserved @Food Store
                    </Text>
                </Flex>
            </Container>
        </Box>
    );
};

export default Footer;
