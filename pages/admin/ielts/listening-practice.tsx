import React from 'react';
import { useRouter } from 'next/router';
import { Spin, Alert, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useGetListeningPracticeByCategoryQuery } from '@/services/listeningPracticeApi';
import ListeningPractice from '@/components/ListeningPractice';
import Container from '@/components/Container';

const ListeningPracticePage: React.FC = () => {
  const router = useRouter();
  const { categoryId, practiceId } = router.query;

  // Fetch listening practice data
  const {
    data: apiResponse,
    isLoading,
    error
  } = useGetListeningPracticeByCategoryQuery(
    { categoryId: Number(categoryId) },
    {
      skip: !categoryId,
      refetchOnMountOrArgChange: true
    }
  );

  // Extract the actual practices array from the new API response
  const practices = apiResponse?.data || [];

  const handleBack = () => {
    router.push('/admin/ielts/listening-categories');
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
          <Alert
            message="Error"
            description="Failed to load listening practice data"
            type="error"
            showIcon
            action={
              <Button size="small" onClick={handleBack}>
                Go Back
              </Button>
            }
          />
        </div>
      </Container>
    );
  }

  if (!practices || practices.length === 0) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <Alert
            message="No Data"
            description="No listening practice available for this category"
            type="info"
            showIcon
            action={
              <Button size="small" onClick={handleBack}>
                Go Back
              </Button>
            }
          />
        </div>
      </Container>
    );
  }

  // Always recalculate selectedPractice on every render
  const selectedPractice = React.useMemo(() => {
    if (!practices) return undefined;
    return practiceId
      ? practices.find(p => p.practiceId === Number(practiceId))
      : practices[0];
  }, [practices, practiceId]);

  if (!selectedPractice) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <Alert
            message="Not Found"
            description="The requested listening practice was not found"
            type="warning"
            showIcon
            action={
              <Button size="small" onClick={handleBack}>
                Go Back
              </Button>
            }
          />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="mb-4"
          >
            Back to Categories
          </Button>
        </div>

        {/* Practice List (if multiple practices available) */}
        {practices.length > 1 && (
          <div className="max-w-7xl mx-auto px-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Available Practices</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {practices.map((practice) => (
                  <div
                    key={practice.practiceId}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      practice.practiceId === selectedPractice.practiceId
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                    }`}
                    onClick={() => router.push({
                      pathname: '/listening-practice',
                      query: { categoryId, practiceId: practice.practiceId }
                    })}
                  >
                    <div className="font-medium">Practice {practice.practiceId}</div>
                    <div className="text-sm text-gray-600">{practice.category}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {practice.practices.length} questions
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Practice Component */}
        <ListeningPractice practiceData={selectedPractice} />
      </div>
    </Container>
  );
};

export default ListeningPracticePage; 