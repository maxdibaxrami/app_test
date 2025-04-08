import { useCallback } from "react";
import { FixedSizeGrid as Grid, GridOnItemsRenderedProps } from "react-window";
import NearByCard from "@/components/naerby/nearByCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { NotFoundLike } from "@/Icons/notFoundLike";
import { useTranslation } from "react-i18next";
import { fetchNearBySliceUsers } from "@/features/nearBySlice";
import { Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import { ProfileBackgroundSvg } from "@/Icons/profileBackgroundSVG";

export default function NearByPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { data: users, loading, page, total, filters, loadingMore } = useSelector((state: RootState) => state.nearBy);
  const { data: user } = useSelector((state: RootState) => state.user);

  // Compute if there are more pages to fetch
  const hasMore = users ? users.length < total : true;

  // Callback to handle fetching users
  const fetchMoreUsers = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      dispatch(
        fetchNearBySliceUsers({
          userId: user.id.toString(),
          page: page,
          limit: 50,
          ...filters,
        })
      );
    }
  }, [dispatch, filters, hasMore, loading, loadingMore, page, user.id]);

  // Loading state for initial data
  if (loading && (!users || users.length === 0)) {
    return (
      <div className="h-screen py-24 flex items-center justify-center w-screen flex-col p-6">
        <Spinner size="lg" />
      </div>
    );
  }

  // No users found
  if (!loading && users && users.length === 0) {
    return (
      <div
        className="h-screen w-screen flex flex-col items-center justify-center"
        style={{ paddingTop: "4.2rem", paddingBottom: "6rem", paddingRight: "18px", paddingLeft: "18px" }}
      >
        <NotFoundLike />
        <div className="flex gap-4 flex-col px-6 text-center items-center">
          <p className="text-tiny">{t("exploreUserFilterNoUser")}</p>
        </div>
      </div>
    );
  }

  // Virtualization: Calculate grid configuration.
  // Outer container horizontal padding: 14px each side (28px total)
  const innerWidth = window.innerWidth - 28;
  const columnCount = 2;
  const rowCount = Math.ceil(users!.length / columnCount);
  const cellWidth = innerWidth / columnCount;
  // Card height based on 3:4 aspect ratio:
  const cardHeight = cellWidth * (4 / 3);
  // Fixed row height for consistent cells.
  const rowHeight = cardHeight;

  // Grid cell renderer: Render each user card inside a container that maintains the 3:4 aspect ratio.
  const Cell = ({
    columnIndex,
    rowIndex,
    style,
  }: {
    columnIndex: number;
    rowIndex: number;
    style: React.CSSProperties;
  }) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= users!.length) return null;
    const userItem = users![index];
    const isLastTwoRows = rowIndex >= rowCount - 1;

    if(!isLastTwoRows){
      return (
        <div style={{ ...style, padding: "6px", paddingTop:"6.2rem" }}>
          <div style={{ width: "100%", aspectRatio: "3/4"}}>
            <NearByCard key={userItem.id} data={userItem} />
          </div>
        </div>
      );
    }
    return (
      <div style={{ ...style,padding: "6px", paddingTop:"6rem",height:"500px"}}>
        <div style={{ width: "100%", aspectRatio: "3/4"}}>
          <NearByCard key={userItem.id} data={userItem} />
        </div>
      </div>
    );
    
  };

  return (
    <div
      style={{
        position: "relative",
        paddingLeft: "14px",
        paddingRight: "14px",

      }}
    >
      {/* Virtualized Grid with onItemsRendered to trigger fetching more data */}
      <Grid
        columnCount={columnCount}
        columnWidth={cellWidth}
        height={window.innerHeight} // Adjust as needed.
        rowCount={rowCount}
        rowHeight={rowHeight}
        width={innerWidth}
        onItemsRendered={({ visibleRowStopIndex }: GridOnItemsRenderedProps) => {
          // If the last row is visible and there's more data, trigger fetch.
          if (visibleRowStopIndex >= rowCount - 1 && hasMore && !loadingMore && !loading) {
            fetchMoreUsers();
          }
        }}
      >
        {Cell}
      </Grid>
      {/* Loading spinner for more data */}
      {loadingMore && hasMore && (
        <div className="w-full mt-6 mb-6 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}

      <motion.div
        transition={{ delay: 2, duration: 2 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed h-full dark:opacity-70 inset-0 flex items-center z-[-10]"
      >
        <ProfileBackgroundSvg width={1200} height={1200} />
      </motion.div>
    </div>
  );
}
