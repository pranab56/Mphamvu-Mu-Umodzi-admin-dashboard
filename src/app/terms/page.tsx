"use client";

import { useGetSettingByKeyQuery } from "@/features/settings/legalDocument/othersApi";

export default function TermsPage() {
  const { data: apiResponse, isLoading, isError } = useGetSettingByKeyQuery({ key: "termsOfService" });
  const htmlContent = apiResponse?.data;

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40">
          <div className="border-b border-slate-200 px-6 py-4 sm:px-10">

            <h1 className="mt-6 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
              Terms and Conditions
            </h1>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            {isLoading ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
                Loading terms content...
              </div>
            ) : isError ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-700">
                Failed to load the terms content. Please try again later.
              </div>
            ) : htmlContent ? (
              <article className="prose prose-slate max-w-none text-slate-800 sm:prose-lg">
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
              </article>
            ) : (
              <div className="rounded-3xl border border-amber-200 bg-amber-50 px-6 py-10 text-center text-sm text-amber-700">
                No terms content is available right now.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
