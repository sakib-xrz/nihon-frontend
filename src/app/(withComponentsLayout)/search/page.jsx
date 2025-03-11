
import SearchImpliment from "@/components/SearchImpliment/SearchImpliment";
export default function SearchPage({ searchParams }) {
    const search = searchParams?.search || '';


    return (
        <SearchImpliment search={search} />
    );
}