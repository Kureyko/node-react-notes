import { DraggableData } from "react-draggable";

export interface NoteType {
  id: string;
  posX: number;
  posY: number;
  value: string;
  color: string;
}

export type NoteOnUpdate = (id: string, value: string | DraggableData) => void;

export interface NoteProps extends NoteType {
  isOwner?: boolean;
  userName: string;
  onUpdate?: NoteOnUpdate;
}

export interface UserType {
  userName: string;
  notes: NoteType[];
}

export enum NoteUpdateType {
  "VALUE",
  "POSITION",
}
