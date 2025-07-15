import React, { useEffect, useState } from 'react';
import { 
    Card, 
    CardContent, 
    Typography, 
    Button,
    Box,
    CircularProgress
} from '@mui/material';

interface WordGroup {
    id: number;
    ipaPattern: string;
    description: string;
    words: string[];
}

const WordGroupGrid: React.FC = () => {
    const [wordGroups, setWordGroups] = useState<WordGroup[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWordGroups = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/word-groups');
            if (!response.ok) {
                throw new Error('Failed to fetch word groups');
            }
            const data = await response.json();
            // Ensure data is an array
            setWordGroups(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching word groups:', error);
            setError('Failed to load word groups');
            setWordGroups([]);
        }
    };

    const handleGroupWords = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8080/api/word-groups/group', {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error('Failed to group words');
            }
            const data = await response.json();
            // Ensure data is an array
            setWordGroups(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error grouping words:', error);
            setError('Failed to group words');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWordGroups();
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1">
                    IPA Word Groups
                </Typography>
                <Button 
                    variant="contained" 
                    onClick={handleGroupWords}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Group Words'}
                </Button>
            </Box>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            {wordGroups.length === 0 ? (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                    No word groups available. Click "Group Words" to start.
                </Typography>
            ) : (
                <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)'
                    },
                    gap: 3
                }}>
                    {wordGroups.map((group) => (
                        <Card key={group.id}>
                            <CardContent>
                                <Typography variant="h5" component="div" gutterBottom>
                                    {group.ipaPattern}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {group.description}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Words:
                                    </Typography>
                                    <Typography variant="body2">
                                        {group.words.join(', ')}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default WordGroupGrid; 