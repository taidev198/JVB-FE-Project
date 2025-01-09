import AboutUsHeader from '@/components/portal/AboutUs/AboutUsHeader';
import PortalLayout from '@/layouts/portal/PortalLayout';

const AboutUs = () => {
  return (
    <div>
      <PortalLayout type="school-list">
        <main>
          <AboutUsHeader />
        </main>
      </PortalLayout>
    </div>
  );
};
export default AboutUs;
