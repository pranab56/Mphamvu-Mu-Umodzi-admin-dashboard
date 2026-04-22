import { Store } from "lucide-react"
import Image from "next/image"

export default function RecentActivity() {
  return (
    <div className="bg-white border border-gray-200/60 rounded-[24px]  p-6 md:p-8 mt-6 flex flex-col md:flex-row gap-8">
      <div className="flex-1 " >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-[17px] font-bold text-gray-900">Recent Activity</h3>

        </div>

        <div className="space-y-7">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex-shrink-0 overflow-hidden relative">
              <Image src="/images/auth/image.png" alt="user" fill className="object-cover" />
            </div>
            <div>
              <p className="text-[14px] text-gray-600 font-medium"><span className="text-gray-900 font-bold">User Alex</span> scanned receipt from <span className="text-[#A53200]">Starbucks</span></p>
              <p className="text-[10px] font-bold text-gray-400 tracking-wider mt-1">2 MINUTES AGO</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center flex-shrink-0">
              <Store className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[14px] text-gray-600 font-medium mb-2.5">Merchant <span className="text-gray-900 font-bold">&apos;Green Bakery&apos;</span> requested approval</p>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 bg-[#A53200] hover:bg-[#007BB5] text-white text-[11px] font-bold rounded-md transition-colors shadow-sm">Approve</button>
                <button className="px-4 py-1.5 bg-gray-200 text-gray-600 hover:bg-gray-300 text-[11px] font-bold rounded-md transition-colors">Review</button>
              </div>
              <p className="text-[10px] font-bold text-gray-400 tracking-wider mt-2.5">15 MINUTES AGO</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 overflow-hidden relative">
              <Image src="/images/auth/image.png" alt="user" fill className="object-cover" />
            </div>
            <div>
              <p className="text-[14px] text-gray-600 font-medium"><span className="text-gray-900 font-bold">David Chen</span> joined the platform</p>
              <p className="text-[10px] font-bold text-gray-400 tracking-wider mt-1">3 HOURS AGO</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-[320px] flex flex-col gap-6">
        <div className="flex justify-between items-center sm:justify-end">
          <button className="text-[13px] font-bold cursor-pointer text-[#A53200] hover:text-[#007BB5] transition-colors p-2 -mr-2">View All Activity</button>
        </div>

        <div className="bg-[#A53200] rounded-[24px] px-6 py-10 w-full text-center shadow-2xl shadow-[#A53200]/30 flex flex-col items-center justify-center relative overflow-hidden group">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

          <p className="text-white/70 text-[11px] font-bold tracking-[0.2em] uppercase mb-2 relative z-10">TOTAL VOLUME TODAY</p>
          <p className="text-white text-4xl font-extrabold tracking-tight relative z-10">$14,230.50</p>

          {/* Decorative element */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
        </div>
      </div>
    </div>
  )
}
