import { RootState } from "@/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Spinner } from "@heroui/react";
import { Navigate } from "react-router-dom";

const FinalStepAuth = ({ setSlideAvailable, setSlideUnAvailable, uploadImageLoading }) => {
  const { loading: authLoading } = useSelector((state: RootState) => state.auth);
  const { loading: userLoading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    setSlideUnAvailable();
    setSlideAvailable();
  }, []);

  // Check if both auth and user are not loading
  if (!authLoading && !userLoading && !uploadImageLoading) {
    return <Navigate to="/main/profile" replace />;
  }

  // Show loading spinner if either auth or user is still loading
  return (
    <div className="flex justify-center items-center h-[100vh] flex-col px-6 pt-8 pb-4">
      <Spinner size="lg"/>      
    </div>
  );
};

export default FinalStepAuth;
