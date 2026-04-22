import LegalManagementPage from "@/components/settings/LegalManagementPage";

export default function page() {
  return (
    <LegalManagementPage
      title="Terms of Service"
      displayTitle="Get Terms of Service"
      subtitle="Last updated: 2024-02-15"
      initialContent={`<h1>Terms of Service</h1><p>Welcome to RIZIPT. By using our platform, you agree to these terms.</p><h2>1. Acceptance of Terms</h2><p>By accessing or using the RIZIPT platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p><h2>2. Use of Service</h2><p>You agree to use the service only for lawful purposes and in a way that does not infringe the rights of others.</p>`}
    />
  );
}

