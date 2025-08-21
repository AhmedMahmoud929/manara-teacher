import { UAParser } from "ua-parser-js";

export const extractDeviceInfo = (parser: UAParser) => {
  const ua = parser.getResult();
  const parts: string[] = [];

  parts.push(ua.device.type || "Desktop");
  if (ua.device.model) parts.push(ua.device.model);
  if (ua.os.name) parts.push(ua.os.name);
  if (ua.os.version) parts.push(ua.os.version);

  return parts.join(".");
};
