"use client";

import { GuidedTour } from "./guided-tour";

interface GuidedTourWrapperProps {
  userId: string;
  forceShow?: boolean;
}

export function GuidedTourWrapper({
  userId,
  forceShow,
}: GuidedTourWrapperProps) {
  return <GuidedTour userId={userId} forceShow={forceShow} />;
}
