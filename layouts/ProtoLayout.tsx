import { FC } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

interface ProtoLayoutProps {
  children: React.ReactNode;
}

const ProtoLayout: FC<ProtoLayoutProps> = ({ children }) => {
  return (
    <div style={{ margin: '0 auto' }}>
      {/* Header */}
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default ProtoLayout;
