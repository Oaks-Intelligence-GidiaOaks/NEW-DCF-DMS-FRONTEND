import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const SkeletonLoaders = ({ count }) => {
  const skeletons = () => {
    const loaderArray = [];

    for (let i = 0; i < count; i++) {
      loaderArray.push(<Skeleton width="100%" height={64} />);
    }
  };

  return (
    <div>
      <SkeletonTheme>
        <div className="h-full">{skeletons()}</div>
      </SkeletonTheme>
    </div>
  );
};

export default SkeletonLoaders;
