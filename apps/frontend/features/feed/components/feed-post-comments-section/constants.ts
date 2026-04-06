/** Above feed fixed chrome (headers use z-[1030]). */
export const FEED_COMMENT_ALERT_STACK_CLASS =
  "fixed top-4 right-4 z-[1100] flex max-h-[calc(100vh-2rem)] w-[min(100vw-2rem,24rem)] flex-col gap-2 overflow-y-auto pointer-events-none";

export const feedEase =
  "transition-[opacity,visibility,transform,background-color,color,box-shadow] duration-200 ease-in-out";

export const DEFAULT_AVATAR = "/images/post_img.png";

/** Align with backend default (max 50). */
export const COMMENTS_PAGE_LIMIT = 15;

export const REPLIES_PAGE_LIMIT = 50;

export const commentActionClass =
  "rounded-sm p-0 text-sm font-semibold text-[var(--feed-meta)] shadow-none outline-none " +
  "hover:bg-transparent hover:text-[var(--color5)] hover:underline dark:hover:bg-transparent " +
  "focus-visible:ring-2 focus-visible:ring-[var(--color5)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)] " +
  "active:opacity-90";
