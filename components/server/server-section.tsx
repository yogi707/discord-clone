"use client";

import { ServerWithMembersWithProfile } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import ActionTooltip from "@/components/ui/action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-model-store";

interface serverSectionProps {
  label?: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server: ServerWithMembersWithProfile;
}

export const ServerSection = ({
  label,
  role,
  sectionType,
  server,
  channelType,
}: serverSectionProps) => {
  const { onOpen } = useModal();
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {role !== MemberRole.GUEST && sectionType === "channels" && (
          <ActionTooltip label="Create channel" side="top">
            <button
              onClick={() => onOpen("createChannel", { server, channelType })}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </ActionTooltip>
        )}

        {role === MemberRole.ADMIN && sectionType === "members" && (
          <ActionTooltip label="Manage members" side="top">
            <button
              onClick={() => onOpen("members", { server })}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            >
              <Settings className="w-4 h-4" />
            </button>
          </ActionTooltip>
        )}
      </p>
    </div>
  );
};
