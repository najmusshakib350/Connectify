import { Alert } from "@/components/ui/alerts/Alert"

import { FeedCenterColumn } from "./FeedCenterColumn"
import { FeedHeaderDesktop } from "./FeedHeaderDesktop"
import { FeedHeaderMobile } from "./FeedHeaderMobile"
import { FeedLeftSidebar } from "./FeedLeftSidebar"
import { FeedMobileBottomNav } from "./FeedMobileBottomNav"
import { FeedModeSwitch } from "./FeedModeSwitch"
import { FeedRightSidebar } from "./FeedRightSidebar"

export function FeedShell() {
  return (
    <Alert>
    <div className="_layout _layout_main_wrapper relative min-h-screen">
      <FeedModeSwitch />
      <div className="_main_layout min-h-screen overflow-hidden bg-[var(--feed-page-bg)] max-[991px]:h-full lg:h-screen">
        <FeedHeaderDesktop />
        <FeedHeaderMobile />
        <FeedMobileBottomNav /> 
        <div className="mx-auto max-w-[1320px] px-3 sm:px-4 lg:max-w-[1160px] xl:max-w-[1320px]">
            <div className="_layout_inner_wrap pt-14 pb-24 max-[991px]:!pt-14 lg:overflow-hidden lg:pt-[70px] lg:pb-0">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <aside className="lg:col-span-3">
                  <FeedLeftSidebar /> 
                </aside>
                <main className="lg:col-span-6">
                  <FeedCenterColumn />
                </main>
                <aside className="lg:col-span-3">
                  <FeedRightSidebar />
                </aside> 
              </div>
            </div>
        </div> 
      </div>
    </div>
    </Alert>
  )
}
