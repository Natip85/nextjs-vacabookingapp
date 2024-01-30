"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { ChangeEventHandler, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
const SearchInput = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const title = searchParams.get("title");

  const [value, setValue] = useState(title || "");

  const debouncedValue = useDebouncedValue<string>(value);

  useEffect(() => {
    const query = {
      title: debouncedValue,
    };
    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  }, [debouncedValue, router]);
  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  if (pathname !== "/") return null;
  return (
    <div className="relative sm:block hidden">
      <Search className="absolute h-4 w-4 top-3 left-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={onChange}
        placeholder="Search"
        className="pl-10 bg-primary/10"
      />
    </div>
  );
};

export default SearchInput;
