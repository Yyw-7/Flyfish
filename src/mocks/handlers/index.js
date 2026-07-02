import { questHandlers } from './quest'
import { travelHandlers } from './travel'
import { diaryHandlers } from './diary'
import { guestbookHandlers } from './guestbook'

export const handlers = [
  ...questHandlers,
  ...travelHandlers,
  ...diaryHandlers,
  ...guestbookHandlers
]
