import {InlineKeyboard} from "grammy";

export const statusKeyboard = new InlineKeyboard()
  .text('🟢  СВЯЗАЛСЯ  🟢', 'status:CONTACTED')
  .text('🔴  НЕТ КОНТАКТА  🔴', 'status:NO_CONTACT')
  .row()
  .text('🟡  ДУБЛЬ  🟡', 'status:DUPLICATE');