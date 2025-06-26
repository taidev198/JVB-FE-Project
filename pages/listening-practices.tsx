import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, Typography, Input, Space, Spin, Alert, Tag, Row, Col } from 'antd';
import { SearchOutlined, PlayCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useGetAllListeningPracticesQuery } from '@/services/listeningPracticeApi';
import Container from '@/components/Container';
import { ListeningPracticeResponseDto } from '@/types/listeningPractice';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const ListeningPracticesPage: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch all listening practices
  const { 
    data: apiResponse, 
    isLoading, 
    error 
  } = useGetAllListeningPracticesQuery(undefined, {
    refetchOnMountOrArgChange: true
  });

  const practices = apiResponse?.data || [];

  const handlePracticeClick = (practice: ListeningPracticeResponseDto) => {
    router.push({
      pathname: '/listening-practice',
      query: { 
        categoryId: practice.id, // Using id as categoryId for now
        practiceId: practice.practiceId 
      }
    });
  };

  const handleBack = () => {
    router.push('/listening-categories');
  };

  // Filter practices based on search term
  const filteredPractices = practices.filter(practice =>
    practice.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    practice.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <Spin size="large" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <Alert
            message="Error"
            description="Failed to load listening practices"
            type="error"
            showIcon
            action={
              <button 
                onClick={handleBack}
                className="ant-btn ant-btn-sm"
              >
                Go Back
              </button>
            }
          />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={handleBack}
                className="text-blue-600 hover:text-blue-800 mb-4"
              >
                ← Back to Categories
              </button>
            </div>
            <Title level={2} className="text-center mb-2">
              All Listening Practices
            </Title>
            <Text className="text-center block text-gray-600">
              Click on any practice to start listening and answering questions
            </Text>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <Search
              placeholder="Search by title or category..."
              allowClear
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined />}
              className="max-w-md mx-auto"
            />
          </div>

          {/* Results Count */}
          <div className="mb-6 text-center">
            <Text className="text-gray-600">
              {filteredPractices.length} practice{filteredPractices.length !== 1 ? 's' : ''} found
            </Text>
          </div>

          {/* Practices Grid */}
          {filteredPractices.length === 0 ? (
            <div className="text-center py-12">
              <Alert
                message="No practices found"
                description={
                  searchTerm 
                    ? `No practices match "${searchTerm}". Try a different search term.`
                    : "No listening practices are available at the moment."
                }
                type="info"
                showIcon
              />
            </div>
          ) : (
            <Row gutter={[16, 16]}>
              {filteredPractices.map((practice) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={`${practice.id}-${practice.practiceId}`}>
                  <Card
                    hoverable
                    onClick={() => handlePracticeClick(practice)}
                    className="h-full cursor-pointer transition-all duration-200 hover:shadow-lg"
                    bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  >
                    <div className="flex-1">
                      {/* Title */}
                      <Title level={5} className="mb-3 line-clamp-2" style={{ minHeight: '48px' }}>
                        {practice.title || `Practice ${practice.practiceId}`}
                      </Title>

                      {/* Category */}
                      {practice.category && (
                        <div className="mb-3">
                          <Tag color="blue" className="mb-2">
                            {practice.category}
                          </Tag>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <QuestionCircleOutlined className="mr-1" />
                          <span>{practice.practices?.length || 0} questions</span>
                        </div>
                        <div className="flex items-center">
                          <PlayCircleOutlined className="mr-1" />
                          <span>Practice {practice.practiceId}</span>
                        </div>
                      </div>

                      {/* Preview of subtitle */}
                      <Paragraph 
                        className="text-gray-600 text-sm line-clamp-3 mb-0"
                        style={{ fontSize: '12px' }}
                      >
                        {practice.sub?.substring(0, 150)}...
                      </Paragraph>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <button 
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePracticeClick(practice);
                        }}
                      >
                        Start Practice
                      </button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </Container>
  );
};

export default ListeningPracticesPage; 