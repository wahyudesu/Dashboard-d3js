"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";

const files = {
  csv: "/data/dashboard.csv",
  excel: "/data/dashboard.xlsx",
  json: "/dash/dashboard.json",
};

export function DownloadButton() {
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
          <Download className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-2">
        <DropdownMenuLabel>Download Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup>
          <DropdownMenuRadioItem onClick={() => downloadFile("csv")} value={"csv"}>
            CSV
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem onClick={() => downloadFile("excel")} value={"excel"}>
            Excel
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem onClick={() => downloadFile("json")} value={"json"}>
            JSON
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
