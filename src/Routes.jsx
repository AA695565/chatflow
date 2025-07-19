import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import RoomCreationJoin from "pages/room-creation-join";
import MessageDetailsStatus from "pages/message-details-status";
import MediaGalleryFileManager from "pages/media-gallery-file-manager";
import ChatRoomInterface from "pages/chat-room-interface";
import RoomSettingsManagement from "pages/room-settings-management";
import Login from "pages/auth/Login";
import Signup from "pages/auth/Signup";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<RoomCreationJoin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/room/:roomId" element={<ChatRoomInterface />} />
        <Route path="/room-creation-join" element={<RoomCreationJoin />} />
        <Route path="/message-details-status" element={<MessageDetailsStatus />} />
        <Route path="/media-gallery-file-manager" element={<MediaGalleryFileManager />} />
        <Route path="/chat-room-interface" element={<ChatRoomInterface />} />
        <Route path="/room-settings-management" element={<RoomSettingsManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;