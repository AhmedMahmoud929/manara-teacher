"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import React, { FormEvent, useState } from "react";

function TableSearchForm({
  onSubmit,
  SearchMechanisms,
}: {
  onSubmit: (
    e: FormEvent<HTMLFormElement>,
    searchMechanism: string,
    inputValue: string
  ) => void;
  SearchMechanisms: { label: string; value: string }[];
}) {
  const [searchMechanism, setSearchMechanism] = useState(SearchMechanisms[0]);
  const [inputValue, setInputValue] = useState("");
  return (
    <form
      onSubmit={(e) => onSubmit(e, searchMechanism.value, inputValue)}
      className="flex flex-col md:flex-row gap-2 self-start md:self-end"
    >
      <Select
        defaultValue={SearchMechanisms[0].value}
        onValueChange={(value) =>
          setSearchMechanism(SearchMechanisms.find((s) => s.value === value)!)
        }
      >
        <SelectTrigger className="w-full sm:w-[110px] lg:w-[180px]">
          <SelectValue placeholder="البحث حسب" />
        </SelectTrigger>
        <SelectContent>
          {SearchMechanisms.map(({ label, value }, ix) => (
            <SelectItem value={value} key={ix}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex">
        <Input
          placeholder={`البحث عن طريق ${searchMechanism.label}...`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="max-w-44 lg:max-w-sm bg-gray-50 border shadow-none rounded-l-none"
        />
        <Button
          type="submit"
          variant="default"
          size="icon"
          className="rounded-r-none opacity-80"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

export default TableSearchForm;
