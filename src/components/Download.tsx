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
import { Download } from "lucide-react";

const files = {
  csv: "/path/to/your-data.csv",
  excel: "/path/to/your-data.xlsx",
  json: "/path/to/your-data.json",
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
        <Button variant="outline">
          <Download className="w-2 h-2" />
        </Button>
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
