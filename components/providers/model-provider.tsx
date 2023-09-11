"use client";

import { useEffect, useState } from "react";
import CreateServerModel from "@/components/models/create-server-model";
import InviteModel from "@/components/models/invite-model";
import EditServerModel from "@/components/models/edit-server-model";
import MembersModel from "@/components/models/manage-members";
import LeaveServerModal from "@/components/models/leave-server";
import DeleteServerModal from "@/components/models/delete-server-mode";
import DeleteChannelModal from "@/components/models/delete-channel-model";
import EditChannelModel from "@/components/models/edit-channel-model";
import MessageFileModel from "@/components/models/message-file";
import DeleteMessageModal from "@/components/models/delete-message.model";
import CreateChannelModal from "@/components/models/create-channel-model";
export const ModelProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  return (
    <>
      <CreateServerModel />
      <InviteModel />
      <EditServerModel />
      <CreateChannelModal />
      <MembersModel />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditChannelModel />
      <MessageFileModel />
      <DeleteMessageModal />
    </>
  );
};
