import React from 'react';
import { useRouter } from 'next/router';
import { Card, Typography, Progress, Space, Spin } from 'antd';
import { useGetIeltsCategoriesQuery } from '@/services/portalHomeApi';
import Container from '@/components/Container';

const { Title, Text } = Typography;

const IeltsCategoriesPage: React.FC = () => {
  const router = useRouter();
  const { data: categoriesResponse, isLoading, error } = useGetIeltsCategoriesQuery();

  const handleCategoryClick = (categoryId: number) => {
    router.push({
      pathname: '/text-questions',
      query: { categoryId },
    });
  };

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
          <Text type="danger">Failed to load categories</Text>
        </div>
      </Container>
    );
  }

  const categories = categoriesResponse?.data || [];

  return (
    <Container>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Title level={2} className="text-center mb-8">IELTS Speaking Categories</Title>
          
          {categories.length === 0 ? (
            <div className="text-center">
              <Text>No categories available</Text>
            </div>
          ) : (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {categories.map((category) => (
                <Card
                  key={category.id}
                  hoverable
                  onClick={() => handleCategoryClick(category.id)}
                  className="w-full cursor-pointer transition-all duration-200 hover:shadow-lg"
                >
                  <div className="space-y-4">
                    <div>
                      <Title level={4} className="mb-2">{category.categoryName}</Title>
                      <Text className="text-gray-600">{category.description}</Text>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Text>Progress</Text>
                        <Text>
                          {category.completedQuestions} / {category.totalQuestions} completed
                        </Text>
                      </div>
                      <Progress
                        percent={Math.round((category.completedQuestions / category.totalQuestions) * 100)}
                        status="active"
                        strokeColor={{
                          '0%': '#108ee9',
                          '100%': '#87d068',
                        }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </Space>
          )}
        </div>
      </div>
    </Container>
  );
};

export default IeltsCategoriesPage; 