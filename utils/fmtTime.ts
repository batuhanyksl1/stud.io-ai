export const fmtTime = (ms: number) =>
    new Date(ms).toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });