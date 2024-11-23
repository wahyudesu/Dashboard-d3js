"use client";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUserRound } from "lucide-react";

const files = {
  csv: "/path/to/your-data.csv",
  excel: "/path/to/your-data.xlsx",
  json: "/path/to/your-data.json",
};

export function AccountButton() {
  const downloadFile = (fileType: keyof typeof files) => {
    const link = document.createElement("a");
    link.href = files[fileType];
    link.download = files[fileType].split("/").pop()!;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <CircleUserRound className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-2">
        <DropdownMenuRadioGroup>
          <DropdownMenuRadioItem onClick={() => downloadFile("csv")} value={"csv"}>
            Register
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem onClick={() => downloadFile("excel")} value={"excel"}>
            Login
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
