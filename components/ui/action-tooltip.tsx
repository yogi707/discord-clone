"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

interface tooltipProps {
  label: string;
  children: React.ReactNode;
  side?: "top" | "left" | "right" | "bottom";
  align?: "start" | "center" | "end";
}

function ActionTooltip(props: tooltipProps) {
  const { children, side, align, label } = props;
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          {label.toLowerCase()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ActionTooltip;
