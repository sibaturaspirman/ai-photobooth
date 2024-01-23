import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <main className="container flex flex-col items-center justify-between">
      <div className="relative flex w-full overflow-x-hidden border-b-4 border-t-4 border-black bg-[#F9B800] font-bold z-20 pointer-events-none">
        <div className="animate-marquee whitespace-nowrap py-2">
            <span className="text-lg tracking-[-.15em]">artificial.intelligence</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">stabble-diffusion</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">SDXL</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">diffusion-edge</span><span className="mx-4">•</span>
        </div>
        <div className="absolute top-0 animate-marquee2 whitespace-nowrap py-2">
            <span className="text-lg tracking-[-.15em]">artificial.intelligence</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">stabble-diffusion</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">SDXL</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">diffusion-edge</span><span className="mx-4">•</span>
        </div>
      </div>

      <div className="absolute w-full top-[36px] left-[-10px] z-10 pointer-events-none">
          <Image
            className="relative h-auto w-full"
            src="/ornament2.png"
            alt="icon"
            width={376}
            height={104}
            priority
          />
      </div>

      <div className="relative flex place-items-center mt-16 z-50">
        <Image
          className="relative"
          src="/logo.svg"
          alt="AI Logo"
          width={344}
          height={244}
          priority
        />
      </div>

      <div className="fixed container bottom-[52px] flex flex-col items-center justify-between w-full border-t-4 border-black bg-[#FE4A17] pt-12 pb-8 font-bold">
        <div className="absolute top-[-76px] right-[20px] pointer-events-none">
          <Image
            className="relative"
            src="/smile.png"
            alt="icon"
            width={112}
            height={112}
            priority
          />
        </div>
        <div className="absolute top-[-67px] left-[13px] pointer-events-none">
          <Image
            className="relative"
            src="/ornament1.png"
            alt="icon"
            width={151}
            height={138}
            priority
          />
        </div>

        <Link href="/generate" className="z-20">
          <button
            role="button"
            aria-label="Click to perform an action"
            className="flex cursor-pointer items-center border-4 border-black bg-[#FDDC07] px-6 py-3 font-bold text-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
          >
            CREATE NOW!
          </button>
          <div className="relative flex items-center justify-center mt-6">
            <Image
              className="relative"
              src="/developed.svg"
              alt="zirolu"
              width={168}
              height={20}
              priority
            />
          </div>
        </Link>
      </div>

      <div className="fixed container bottom-0 flex w-full overflow-x-hidden border-b-4 border-t-4 border-black bg-[#F9B800] font-bold pointer-events-none">
        <div className="animate-marquee3 whitespace-nowrap py-2">
            <span className="text-lg tracking-[-.15em]">machine.learning</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">LoRA</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">image-to-image</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">affine.matrix</span><span className="mx-4">•</span>
        </div>
        <div className="absolute top-0 animate-marquee4 whitespace-nowrap py-2">
            <span className="text-lg tracking-[-.15em]">machine.learning</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">LoRA</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">image-to-image</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">affine.matrix</span><span className="mx-4">•</span>
        </div>
      </div>
    </main>
  );
}
