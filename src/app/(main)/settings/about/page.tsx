import LegalManagementPage from "@/components/settings/LegalManagementPage";

export default function page() {
  return (
    <LegalManagementPage
      title="About Us"
      displayTitle="Get About Us"
      subtitle="Last updated: 2024-02-18"
      initialContent={`<h1>About RIZIPT</h1><p>RIZIPT is a cutting-edge receipt scanning and merchant management platform built to streamline the way businesses handle transactions, loyalty programs, and offer redemptions.</p><h2>Our Mission</h2><p>Our mission is to empower merchants and users with seamless, intelligent tools that make every transaction meaningful.</p>`}
    />
  );
}

