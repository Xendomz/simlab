import { useContext } from "react";
import { DepedencyContext } from "./DepedencyProvider";

export const useDepedencies = () => useContext(DepedencyContext)