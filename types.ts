
export interface Subtitle {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
}

export interface CropRect {
  y: number; // 0-100
  x: number;
  width: number;
  height: number;
}

export interface VideoSegment {
  startTime: number;
  endTime: number;
  summary: string;
  subtitles: Subtitle[];
  gameplayCrop?: CropRect;
  faceCamCrop?: CropRect;
}

export type LayoutMode = 'standard' | 'gaming-split';

export interface StylingConfig {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  backgroundColor: string;
  shadowColor: string;
  positionY: number;
  isUppercase: boolean;
  layout: LayoutMode;
  faceZoom: number; // 1-2
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  EDITING = 'EDITING',
  EXPORTING = 'EXPORTING'
}
