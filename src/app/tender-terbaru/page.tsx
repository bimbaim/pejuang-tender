import TenderHeader from './components/TenderHeader';
import TenderContent from './components/TenderContent';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export default function TenderTerbaruPage() {
  return (
    <main>
      <Navbar />
      <TenderHeader />
      <TenderContent />
      <Footer />
    </main>
  );
}