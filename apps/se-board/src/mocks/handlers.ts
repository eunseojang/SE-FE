import { accountHandlers } from "./accountHandlers";
import { adminHandlers } from "./adminHandlers";
import { putLoginLimitTimeHandler } from "./loginHandlers";
import { memberManageHandlers } from "./memberManageHandlers";
import { postManageHandlers } from "./postManageHandlers";

export const handlers = [
  ...putLoginLimitTimeHandler,
  ...memberManageHandlers,
  ...postManageHandlers,
  ...accountHandlers,
  ...adminHandlers,
];
