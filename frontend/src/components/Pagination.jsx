import React from 'react';
import {
    HStack,
    Button,
    Text,
    Box
} from '@chakra-ui/react';
import { useColorModeValue } from './ui/color-mode';

const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    hasNextPage, 
    hasPrevPage,
    totalItems,
    itemsPerPage 
}) => {
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const textColor = useColorModeValue('gray.600', 'gray.200');

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        
        if (totalPages <= maxPagesToShow) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show pages around current page
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, currentPage + 2);
            
            // Adjust if we're near the beginning or end
            if (currentPage <= 3) {
                end = Math.min(totalPages, 5);
            }
            if (currentPage >= totalPages - 2) {
                start = Math.max(1, totalPages - 4);
            }
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        }
        
        return pages;
    };

    const pageNumbers = getPageNumbers();
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    if (totalPages <= 1) {
        return null; // Don't show pagination if only one page
    }

    return (
        <Box
            w="full"
            bg={bg}
            p={4}
            rounded="lg"
            border="1px solid"
            borderColor={borderColor}
        >
            <HStack justify="space-between" wrap="wrap" spacing={4}>
                {/* Items info */}
                <Text fontSize="sm" color={textColor}>
                    Showing {startItem}-{endItem} of {totalItems} items
                </Text>

                {/* Pagination controls */}
                <HStack spacing={2}>
                    {/* Previous button */}
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={!hasPrevPage}
                        colorScheme="blue"
                    >
                        Previous
                    </Button>

                    {/* Page numbers */}
                    {pageNumbers.map((pageNum) => (
                        <Button
                            key={pageNum}
                            size="sm"
                            variant={pageNum === currentPage ? "solid" : "outline"}
                            colorScheme="blue"
                            onClick={() => onPageChange(pageNum)}
                            minW="40px"
                        >
                            {pageNum}
                        </Button>
                    ))}

                    {/* Next button */}
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={!hasNextPage}
                        colorScheme="blue"
                    >
                        Next
                    </Button>
                </HStack>
            </HStack>
        </Box>
    );
};

export default Pagination;
