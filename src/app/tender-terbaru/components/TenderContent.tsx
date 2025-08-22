import React from 'react';
import styles from './TenderContent.module.css';
import TenderSidebar from './TenderSidebar';
import TenderCard from './TenderCard';

const dummyTenders = [
  {
    type: 'Pengumuman Pascakualifikasi',
    title: 'Renovasi Gedung Kantor Operasional',
    lelangCode: '10000367000',
    unitKerja: 'Badan Meteorologi, Klimatologi Dan Geofisika',
    hps: '6,8 M',
    lelangLink: 'https://lpse.maprocid.bmkg/lelang/10000367000',
  },
  {
    type: 'Evolusi Administrasi, Kualifikasi, Teknik, dan Harga',
    title: 'Renovasi Gedung Kantor Operasional',
    lelangCode: '10000367000',
    unitKerja: 'Badan Meteorologi, Klimatologi Dan Geofisika',
    hps: '6,8 M',
    lelangLink: 'https://lpse.maprocid.bmkg/lelang/10000367000',
  },
  {
    type: 'Surat Penunjukan Penyedia Barang/Jasa',
    title: 'Renovasi Gedung Kantor Operasional',
    lelangCode: '10000367000',
    unitKerja: 'Badan Meteorologi, Klimatologi Dan Geofisika',
    hps: '6,8 M',
    lelangLink: 'https://lpse.maprocid.bmkg/lelang/10000367000',
  },
  {
    type: 'Penandatanganan Kontrak',
    title: 'Renovasi Gedung Kantor Operasional',
    lelangCode: '10000367000',
    unitKerja: 'Badan Meteorologi, Klimatologi Dan Geofisika',
    hps: '6,8 M',
    lelangLink: 'https://lpse.maprocid.bmkg/lelang/10000367000',
  },
];

const TenderContent = () => {
  return (
    <div className={styles.mainContent}>
      <div className={styles.container}>
        <TenderSidebar />
        <div className={styles.tenderList}>
          {dummyTenders.map((tender, index) => (
            <TenderCard
              key={index}
              type={tender.type}
              title={tender.title}
              lelangCode={tender.lelangCode}
              unitKerja={tender.unitKerja}
              hps={tender.hps}
              lelangLink={tender.lelangLink}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TenderContent;