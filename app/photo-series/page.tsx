import { Header } from "@/components/ui/header-on-page";
import Image from "next/image";
import { Separator } from "@components/ui/separator";
import Link from "next/link";
import AnimationWrapper from "@/components/ui/animation-wrapper";
import { Metadata } from "next";


export default function photoSeries() {
  
  return (
    <AnimationWrapper>
      <Header
        title="Photo Series"
        subtitle="Photographs in meaningful grouping."
        subtitle2="A message conveyed, a feeling captured through a series of images."
      />

     
    </AnimationWrapper>
  );
};
