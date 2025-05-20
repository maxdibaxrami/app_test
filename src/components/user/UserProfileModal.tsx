// src/components/UserProfileModal.tsx
import React, { lazy, Suspense, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Modal, ModalContent, Spinner } from "@heroui/react";

const ProfilePage = lazy(() => import("@/pages/userPage/index"));        // ← code-split

const UserProfileModal: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userId = searchParams.get("user");          // ?user=123
  const [isOpen, setIsOpen] = useState(Boolean(userId));

  /* keep modal state in sync with URL */
  useEffect(() => setIsOpen(Boolean(userId)), [userId]);

  const handleClose = () => {
    setIsOpen(false);
    searchParams.delete("user");                    // pop the param
    navigate({ search: searchParams.toString() }, { replace: true });
  };

  /* nothing to render when closed → no extra work */
  if (!isOpen) return null;

  return (
    <Modal  hideCloseButton classNames={{"wrapper":"px-4"}} scrollBehavior={"inside"} isOpen size="5xl" onClose={handleClose}>
      <ModalContent className="py-1">
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
