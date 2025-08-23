import { ServiceState } from "../types";

export const emptyService = (): ServiceState => ({ status: "idle", progress: 0 });
