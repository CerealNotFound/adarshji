import { StageLoader } from "@/components/gl/stage-loader";
import { Hud } from "@/components/hud/hud";
import { Footer } from "@/components/sections/footer";
import { SmoothScroll } from "@/providers/smooth-scroll";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <SmoothScroll>
      <StageLoader />
      <Hud />
      <div className="relative z-10 flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
