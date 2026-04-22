import { MemberHeader } from "@/components/members/MemberHeader";
import { MemberStats } from "@/components/members/MemberStats";
import { MemberSearch } from "@/components/members/MemberSearch";
import { MemberTable } from "@/components/members/MemberTable";

export default function MembersPage() {
    return (
        <div className="">
            {/* Page Header */}
            <MemberHeader />

            {/* Statistics Cards */}
            <MemberStats />

            {/* Content Section */}
            <div className="">
                {/* Search Bar */}
                <MemberSearch />

                {/* Data Table */}
                <MemberTable />
            </div>
        </div>
    )
}
