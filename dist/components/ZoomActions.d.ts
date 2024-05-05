import { MouseEventHandler } from 'react';

declare const ZoomActions: ({ zoomIn, zoomOut, zoomFit, }: {
    zoomIn?: MouseEventHandler;
    zoomOut?: MouseEventHandler;
    zoomFit?: MouseEventHandler;
}) => import("react/jsx-runtime").JSX.Element;
export default ZoomActions;
