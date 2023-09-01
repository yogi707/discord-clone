"use client";

import { useEffect, useState } from "react";
import CreateServerModel from "../models/create-server-model";
import InviteModel from "../models/invite-model";
import EditServerModel from "../models/edit-server-model";
import MembersModel from "../models/manage-members";
import LeaveServerModal from "../models/leave-server";
import DeleteServerModal from "../models/delete-server-mode";
import DeleteChannelModal from "../models/delete-channel-model";
import EditChannelModel from "../models/edit-channel-model";
import MessageFileModel from "../models/message-file";
import DeleteMessageModal from "../models/delete-message.model";
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
