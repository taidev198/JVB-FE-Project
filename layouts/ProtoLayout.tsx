import { FC } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { Loading } from '@/components/Common/Loading';
import { useAppSelector } from '@/store/hooks';

interface ProtoLayoutProps {
  children: React.ReactNode;
}

const ProtoLayout: FC<ProtoLayoutProps> = ({ children }) => {
  const isLoading = useAppSelector(state => state.global.isLoading);

  return (
    <div style={{ margin: '0 auto' }}>
      {isLoading && <Loading />}
      {/* Header */}
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default ProtoLayout;
