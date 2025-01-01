import {
  initDataStartParam,
  useSignal,
  initData,
  useLaunchParams,
} from "@telegram-apps/sdk-react";
import { z } from "zod";

const startParamSchema = z
  .object({
    chat_id: z.number().optional(),
    chat_type: z.string().optional(),
  })
  .nullable();

const useStartParams = () => {
  const { startParam: tmaStartParam } = useLaunchParams();

  if (!tmaStartParam) {
    return null;
  }

  // Convert base64 string to JSON object
  const startParamJsonStr = atob(tmaStartParam) || "{}";
  const startParamData = JSON.parse(startParamJsonStr);

  const parseResult = startParamSchema.safeParse(startParamData);

  if (!parseResult.success) {
    console.error(parseResult.error);
    return null;
  }

  return parseResult.data;
};

export default useStartParams;
