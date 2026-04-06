"use client";

export function FeedTimelinePostBody({
  text,
  imageSrc,
}: {
  text: string;
  imageSrc: string | null;
}) {
  return (
    <>
      {text.trim().length > 0 ? (
        <h4 className="_feed_inner_timeline_post_title m-0 mb-4 whitespace-pre-wrap text-sm leading-[21px] font-normal text-[var(--feed-text-body)]">
          {text}
        </h4>
      ) : null}
      {imageSrc ? (
        <div className="_feed_inner_timeline_image mb-6">

          <img
            src={imageSrc}
            alt=""
            className="_time_img h-auto w-full rounded-[6px]"
          />
        </div>
      ) : null}
    </>
  );
}
