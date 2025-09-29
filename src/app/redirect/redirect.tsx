// pages/redirect.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Redirect() {
  const router = useRouter();

  useEffect(() => {
    if (router.query.url) {
      // decode target URL
      const target = decodeURIComponent(router.query.url as string);
      window.location.href = target;
    }
  }, [router.query]);

  return <p>Redirecting...</p>;
}