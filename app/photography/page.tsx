import ImageContainer from "@/components/image-container";
import AnimationWrapper from "@/components/ui/animation-wrapper";
import { Header } from "@/components/ui/header-on-page";
import { Metadata } from "next";
import Image from "next/image";


export default function Photography() {

  return (
    <AnimationWrapper>
      <div>
        <Header
          title="Photography"
          subtitle="A moment in time and space, captured and rendered for its perceived beauty."
        />
        <section className="grid md:grid-cols-gallery auto-rows-[5px] py-24 md:mx-1">
          <ImageContainer />
        </section>
      </div>
    </AnimationWrapper>
  );
}
