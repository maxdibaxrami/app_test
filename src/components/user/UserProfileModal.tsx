// src/components/UserProfileModal.tsx
import React, { lazy, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Modal, ModalContent, Spinner } from "@heroui/react";

const ProfilePage = lazy(() => import("@/pages/userPage/index"));        // ← code-split

const UserProfileModal: React.FC = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user");          // ?user=123
  const [isOpen, setIsOpen] = useState(Boolean(userId));

  /* keep modal state in sync with URL */
  useEffect(() => setIsOpen(Boolean(userId)), [userId]);


  /* nothing to render when closed → no extra work */
  if (!isOpen) return null;

  return (
    <Modal classNames={{"base":"m-0 p-0 "}} backdrop="opaque" hideCloseButton scrollBehavior={"inside"} isOpen={!!userId} size="5xl">
      <ModalContent className="py-0.5 px-0.5">
        {() => (
          <Suspense
            fallback={
              <div className="flex justify-center p-8">
                <Spinner size="lg" />
              </div>
            }
          >
            <ProfilePage />                          {/* retains its own searchParams logic */}
          </Suspense>
        )}
      </ModalContent>
    </Modal>
  );
};

export default React.memo(UserProfileModal);
