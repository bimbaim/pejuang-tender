"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from 'next/navigation'; 
import { supabase } from "@/lib/supabase"; 

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import CallToActionSection from "@/components/home/CallToActionSection";
import PricingSection from "@/components/home/PricingSection"; 
import TrialPopupForm from "@/components/common/TrialPopupForm";
import PackagePopupForm from "@/components/common/PackagePopupForm";
import Testimonial from "@/components/home/Testimonial";
import HowItWorks from "@/components/home/HowItWorks";

import type { Plan } from "@/types/plan";

// DEFINISI TIPE BARU
interface AutoFillData {
    name: string;
    email: string;
    whatsapp: string; 
    category: string[];
    spse: string[];
    keywords: string[];
    subscriptionId: string;
}

// Definisikan tipe untuk User data dari Join
interface UserData {
    name: string;
    email: string;
    phone: string;
}

export default function HomePageContent() {
  const searchParams = useSearchParams(); 

  // --- STATE DATA PAKET ---
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true); 
  const [plansReady, setPlansReady] = useState(false); 
  
  // --- Trial Popup State ---
  const [isTrialPopupOpen, setIsTrialPopupOpen] = useState(false);
  const handleOpenTrialPopup = () => setIsTrialPopupOpen(true);
  const handleCloseTrialPopup = () => setIsTrialPopupOpen(false);

  // --- Package Popup State ---
  const [isPackagePopupOpen, setIsPackagePopupOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Plan | null>(null);

  // STATE: Untuk menyimpan data auto-fill dari subscription
  const [initialFormData, setInitialFormData] = useState<Partial<AutoFillData>>({});
  const [loadingSubscription, setLoadingSubscription] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleOpenPackagePopup = useCallback((pkg: Plan, _initialData?: Partial<AutoFillData>) => { 
    setSelectedPackage(pkg);
    setIsPackagePopupOpen(true);
  }, []); 

  const handleClosePackagePopup = () => {
    setIsPackagePopupOpen(false);
    setSelectedPackage(null);
  };
  
  // LOGIKA 1: Ambil Paket dari Supabase
  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true);
      const { data, error } = await supabase
        .from("packages")
        .select("*");
      
      if (error) {
        console.error("Error fetching plans for page:", error);
      } else {
        setAvailablePlans(data as Plan[]);
        setPlansReady(true); 
      }
      setLoadingPlans(false);
    };

    fetchPlans();
  }, []); 
  
// LOGIKA 2: Efek untuk Memuat Data Langganan & Auto-Open Paket (FIXED STABILITY)
  useEffect(() => {
    
    // GATING: Jangan jalankan logika jika plans belum siap (menunggu fetchPlans selesai)
    if (!plansReady) return; 

    const subIdFromUrl = searchParams.get('subscription_id');
    const packageIdFromUrl = searchParams.get('paket');

    // Helper function untuk memicu pembukaan popup (TETAP SAMA)
    const triggerAutoOpen = (formData: Partial<AutoFillData>) => {
        if (packageIdFromUrl && availablePlans.length > 0) {
            const targetPackage = availablePlans.find(
                (p: Plan) => p.id === packageIdFromUrl
            );
            
            if (targetPackage) {
                // Dipanggil dengan data yang sudah final/tersedia
                handleOpenPackagePopup(targetPackage, formData); 
                // TAMBAHKAN LOG UNTUK MEMASTIKAN DATA TERKIRIM
                console.log("Data yang dikirim ke PackagePopupForm (initialData):", formData);
            }
        }
    };


    // A. Fetch Data Auto-Fill (Jika ada subscription_id)
    if (subIdFromUrl) {
      // 🚀 PERBAIKAN: VALIDASI UUID SEBELUM PANGGILAN API 🚀
      // Regex sederhana untuk memeriksa format UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      if (!uuidRegex.test(subIdFromUrl)) {
        console.warn(`WARNING: subscription_id "${subIdFromUrl}" di URL bukanlah format UUID yang valid. Melewatkan pengambilan data langganan.`);
        // Set loading ke false dan trigger open dengan data kosong
        setLoadingSubscription(false);
        setInitialFormData({});
        triggerAutoOpen({});
        return; // Hentikan eksekusi jika UUID tidak valid
      }

      const fetchSubscriptionData = async () => {
        setLoadingSubscription(true);
        // Ambil data langganan dan detail pengguna terkait
        const { data: subData, error: subError } = await supabase
            .from('subscriptions')
            .select(`
                package_id, category, spse, keyword,
                user:user_id (name, email, phone)
            `)
            .eq('id', subIdFromUrl)
            .single();

        let dataToSet: Partial<AutoFillData> = {};
        let user: UserData | null = null;
        
        if (subError) {
            console.error("Error fetching subscription details:", subError.message);
        } else if (subData) {
            
            // 🚀 PERBAIKAN LOGIKA EKSTRAKSI USER DATA (MENGATASI TS2352) 🚀
            // Supabase kadang mengembalikan objek tunggal, kadang array [objek]
            if (Array.isArray(subData.user) && subData.user.length > 0) {
                user = subData.user[0] as UserData; // Ekstrak elemen pertama dan cast ke UserData
            } else if (subData.user && typeof subData.user === 'object') {
                // Menggunakan 'as unknown as UserData' untuk mengatasi TS error 2352
                user = subData.user as unknown as UserData; // Jika objek tunggal
            }

            // --- DEBUG LOG ---
            console.log("--- DEBUG: Data Langganan dari Supabase (subData) ---");
            console.log(subData);
            console.log("--- DEBUG: Objek User yang berhasil diekstrak ---");
            console.log(user);
            // --- END DEBUG LOG ---
            
            // Pastikan user objek ada sebelum melanjutkan
            if (user) {
                // Konversi data dari database ke format local form
                dataToSet = {
                    name: user.name,
                    email: user.email,
                    whatsapp: user.phone, 
                    category: (subData.category || []) as string[],
                    spse: (subData.spse || []) as string[],
                    keywords: (subData.keyword || []) as string[],
                    subscriptionId: subIdFromUrl, 
                };
            }
        }
        
        // Simpan data ke state
        setInitialFormData(dataToSet);
        setLoadingSubscription(false);

        // **PINDAH LOGIKA AUTO-OPEN KE SINI: SETELAH DATA DITARIK**
        triggerAutoOpen(dataToSet);
      };
      fetchSubscriptionData();

    } else {
        // Jika tidak ada sub ID, reset data dan langsung coba auto-open (menggunakan data kosong)
        console.log("Tidak ada subscription_id di URL. Initial data dikosongkan.");
        setInitialFormData({}); 
        triggerAutoOpen({});
    }
  // MENGEMBALIKAN availablePlans untuk mematuhi aturan dependency linting
  }, [searchParams, plansReady, handleOpenPackagePopup, availablePlans]); 
  
// 🚀 PERBAIKAN: Efek untuk Penanganan Auto-Scroll menggunakan Hash Fragment DAN/ATAU subscription_id
  useEffect(() => {
    // Pastikan DOM sudah dimuat dan plans sudah siap (agar PricingSection ada)
    if (plansReady) {
      const hash = window.location.hash;
      // Cek apakah ada subscription ID di URL
      const subIdFromUrl = searchParams.get('subscription_id'); 

      let targetId: string | null = null;
      
      // Kriteria 1: Jika ada hash (misalnya #paket)
      if (hash) {
        targetId = hash.substring(1);
      } 
      // Kriteria 2: Jika tidak ada hash TAPI ada subscription_id
      else if (subIdFromUrl) {
          targetId = 'paket'; // Auto-scroll ke PricingSection
      }

      if (targetId) {
        // Menggunakan setTimeout untuk memastikan DOM/Layout sudah sepenuhnya stabil.
        // Penundaan 100ms adalah trik umum untuk mengatasi masalah scrollIntoView di Next.js/SPA.
        const timeoutId = setTimeout(() => {
            // Gunakan non-null assertion (!) karena kita sudah memastikan targetId tidak null
            const targetElement = document.getElementById(targetId!); 
            
            if (targetElement) {
                console.log(`Auto-scrolling to #${targetId} (Triggered by Hash or Subscription ID)`);
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100); // Penundaan singkat

        return () => clearTimeout(timeoutId);
      }
    }
  }, [plansReady, searchParams]); // Tambahkan searchParams sebagai dependency


  return (
    <main>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <WhyUsSection />
      <CallToActionSection onOpenPopup={handleOpenTrialPopup} />
      <Testimonial />
      <HowItWorks />

      <PricingSection 
        plansData={availablePlans}
        loading={loadingPlans}
        // Panggilan ini hanya mengirim 1 argumen (pkg), yang valid karena argumen kedua di-handleOpenPackagePopup opsional.
        onOpenPackagePopup={handleOpenPackagePopup}
        loadingSubscription={loadingSubscription}
      />

      <Footer />

      {/* Popups */}
      <TrialPopupForm
        isOpen={isTrialPopupOpen}
        onClose={handleCloseTrialPopup}
      />

     <PackagePopupForm
        isOpen={isPackagePopupOpen}
        onClose={handleClosePackagePopup}
        selectedPackage={selectedPackage} 
        // Mengirim data auto-fill
        initialData={initialFormData} 
      />
    </main>
  );
}
