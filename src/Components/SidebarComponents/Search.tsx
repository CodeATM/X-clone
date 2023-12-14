import React from "react";
import { BsSearch } from "react-icons/bs";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const enccodedSearchQuery = encodeURI(searchQuery);
    router.push(`/search?q=${enccodedSearchQuery}`);
  };
  return (
    <form className="relative" onSubmit={onSearch}>
      <input
        className="border-[1px] border-borderColor rounded-[5rem] bg-twitterWhite py-2 pr-4 pl-12 text-[1rem] font-[400] text-twitterBlack w-[235px] focus:outline-none focus:shadow-outline-twitterBlue focus:shadow-twitterBlue placeholder:text-twitterGray" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search Twitter"
        required
      />
      <BsSearch className='absolute left-4 top-[50%] transform translate-y-[-50%] text-twitterBlue' />
    </form>
  );
};

export default Search;
