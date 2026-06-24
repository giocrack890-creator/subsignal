"use client";

import { GuidedTour } from "./guided-tour";

interface GuidedTourWrapperProps {
  forceShow?: boolean;
  tourCompleted?: boolean;
}

export function GuidedTourWrapper({
  forceShow,
  tourCompleted,
}: GuidedTourWrapperProps) {
  return (
    <GuidedTour forceShow={forceShow} tourCompleted={tourCompleted} />
  );
}
