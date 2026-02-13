import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

/** Pre-typed useDispatch hook – use this instead of plain useDispatch */
export const useAppDispatch: () => AppDispatch = useDispatch;

/** Pre-typed useSelector hook – use this instead of plain useSelector */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
