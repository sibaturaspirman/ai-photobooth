'use client';

import * as fal from '@fal-ai/serverless-client';
import { useMemo, useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { RiCameraLine } from "react-icons/ri";


// @snippet:start(client.config)
fal.config({
  // credentials: 'FAL_KEY_ID:FAL_KEY_SECRET',
  requestMiddleware: fal.withProxy({
    targetUrl: '/api/fal/proxy', // the built-int nextjs proxy
    // targetUrl: 'http://localhost:3333/api/fal/proxy', // or your own external proxy
  }),
});
// @snippet:end

// @snippet:start(client.result.type)
type Image = {
  url: string;
  file_name: string;
  file_size: number;
};
type Result = {
  image: Image;
};
type FaceSwapResult = {
  image: Image;
};
// @snippet:end

type ErrorProps = {
  error: any;
};

function Error(props: ErrorProps) {
  if (!props.error) {
    return null;
  }
  return (
    <div
      className="p-4 mb-4 text-sm text-red-800 rounded bg-red-50 dark:bg-gray-800 dark:text-red-400"
      role="alert"
    >
      <span className="font-medium">Error</span> {props.error.message}
    </div>
  );
}

// const DEFAULT_PROMPT = 'an astronaut is on a spaceship, view of the earth from sss
const DEFAULT_PROMPT = "A handsome man stands amidst the hustle and bustle of New York City, surrounded by towering skyscrapers. He is adorned in a well-fitted black suit, exuding elegance and confidence. The glint in his eyes captures the vibrant energy of the busy city, reflecting his allure to the dynamic metropolitan life. Meanwhile, in his right hand, he holds a cup of coffee, symbolizing a brief moment of tranquility amid the never-ending buzz of the city that never sleeps. The scene resembles a snapshot from the pages of The New York Times, capturing the essence of prestigious and intelligent urban living. Write a continuation of this man's story and how the New York atmosphere influences his life, high quality, highly detailed, high resolution, sharp, hyper realistic, extremely detailed";
const DEFAULT_NEG_PROMPT = 'two faces, two heads, two bodies, boobs, sexy, bad anatomy, bad hands, blurry, low resolution, bad, ugly, low quality, pixelated, interpolated, compression artifacts, noisey, grainy';
let URL_RESULT = ''


export default function Home() {
  // @snippet:start("client.ui.state")
  // Input state
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
  const [promptNegative, setPromptNegative] = useState<string>(DEFAULT_NEG_PROMPT);
  const [CGF, setCGF] = useState<number>(7.5);
  const [SEED, setSEED] = useState<number>(100);
  const [numSteps, setNumSteps] = useState<number>(50);
  const [numProses, setNumProses] = useState<number>(0);
  // const negative_prompt = DEFAULT_NEG_PROMPT;
  const [imageFile, setImageFile] = useState<File | null>(null);
  // Result state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [resultFaceSwap, setResultFaceSwap] = useState<FaceSwapResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  // @snippet:end
  const image = useMemo(() => {
    if (!result) {
      return null;
    }
    if (result.image) {
      return result.image;
    }
    return null;
  }, [result]);
  const imageFaceSwap = useMemo(() => {
    if (!resultFaceSwap) {
      return null;
    }
    if (resultFaceSwap.image) {
      return resultFaceSwap.image;
    }
    return null;
  }, [resultFaceSwap]);

  const reset = () => {
    setLoading(false);
    setError(null);
    setResult(null);
    setResultFaceSwap(null);
    setLogs([]);
    setElapsedTime(0);
  };
  const reset2 = () => {
    setLoading(false);
    setError(null);
    // setLogs([]);
    setElapsedTime(0);
  };
  const generateImage = async () => {
    reset();
    // @snippet:start("client.queue.subscribe")
    setLoading(true);
    const start = Date.now();
    setNumProses(1)
    try {
      const result: Result = await fal.subscribe(
        'fal-ai/ip-adapter-face-id',
        {
          input: {
            prompt,
            face_image_url: imageFile,
            negative_prompt: promptNegative,
            guidance_scale: CGF,
            num_inference_steps: numSteps,
            seed: SEED,
            width: 624,
            height: 864
          },
          pollInterval: 5000, // Default is 1000 (every 1s)
          logs: true,
          onQueueUpdate(update) {
            setElapsedTime(Date.now() - start);
            if (
              update.status === 'IN_PROGRESS' ||
              update.status === 'COMPLETED'
            ) {
              setLogs((update.logs || []).map((log) => log.message));
              // console.log(update)
            }
          },
        }
      );
      setResult(result);
      URL_RESULT = result.image.url
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
      setElapsedTime(Date.now() - start);
      setNumProses(2)
      generateImageSwap()
    }
    // @snippet:end
  };


  const generateImageSwap = async () => {
    // console.log(URL_RESULT)
    reset2();
    // @snippet:start("client.queue.subscribe")
    setLoading(true);
    const start = Date.now();
    try {
      const result: Result = await fal.subscribe(
        'fal-ai/face-swap',
        {
          input: {
            base_image_url: URL_RESULT,
            swap_image_url: imageFile
          },
          pollInterval: 5000, // Default is 1000 (every 1s)
          logs: true,
          onQueueUpdate(update) {
            setElapsedTime(Date.now() - start);
            if (
              update.status === 'IN_PROGRESS' ||
              update.status === 'COMPLETED'
            ) {
              setLogs((update.logs || []).map((log) => log.message));
            }
          },
        }
      );
      setResultFaceSwap(result);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
      setElapsedTime(Date.now() - start);
    }
    // @snippet:end
  };
  return (
    <main className="container flex flex-col items-center justify-between overflow-x-hidden">
      <div className="fixed container flex w-full overflow-x-hidden border-b-4 border-t-4 border-black bg-[#F9B800] font-bold z-30 pointer-events-none">
        <div className="animate-marquee whitespace-nowrap py-2">
            <span className="text-lg tracking-[-.15em]">artificial.intelligence</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">stabble-diffusion</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">SDXL</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">diffusion-edge</span><span className="mx-4">•</span>
        </div>
        <div className="absolute top-0 animate-marquee2 whitespace-nowrap py-2">
            <span className="text-lg tracking-[-.15em]">artificial.intelligence</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">stabble-diffusion</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">SDXL</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">diffusion-edge</span><span className="mx-4">•</span>
        </div>
      </div>

      <div className='relative w-full flex flex-col	place-items-center mt-20 mb-28 px-4 z-20'>
        <div className='relative w-full'>
          <h1 className='mb-4 font-bold text-lg'>PLAYGROUND : <br></br> PHOTO & TEXT TO IMAGE</h1>
          <div className="w-full mb-4">
            <label htmlFor="prompt" className="block mb-2 text-current font-bold">Prompt</label>
            <div className="flex w-full items-center border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <textarea
                className="w-full text-lg p-2 rounded bg-black/10 dark:bg-white/5 border border-black/20 dark:border-white/10 h-[150px]"
                id="prompt"
                name="prompt"
                placeholder="Imagine..."
                value={prompt}
                autoComplete="off"
                onChange={(e) => setPrompt(e.target.value)}
                onBlur={(e) => setPrompt(e.target.value.trim())}
              />
            </div>
          </div>
          <div className="w-full mb-4">
            <label htmlFor="promptNegative" className="block mb-2 text-current font-bold">Negative Prompt</label>
            <div className="flex w-full items-center border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <textarea
                className="w-full text-lg p-2 rounded bg-black/10 dark:bg-white/5 border border-black/20 dark:border-white/10 h-[150px]"
                id="promptNegative"
                name="promptNegative"
                placeholder="Imagine..."
                value={promptNegative}
                autoComplete="off"
                onChange={(e) => setPromptNegative(e.target.value)}
                onBlur={(e) => setPromptNegative(e.target.value.trim())}
              />
            </div>
          </div>
          <div className='w-full mb-4'>
            <label htmlFor="cgf" className="block mb-2  mt-4 text-current font-bold">Guidance scale (CFG) : seberapa mendekati dari prompt ke hasil (max 16)</label>
            <div className="flex w-full items-center border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <input
                className="w-full p-[10px] outline-none"
                id="cgf"
                name="cgf"
                type="number"
                placeholder="Ex : 7"
                value={CGF}
                onChange={(e) => setCGF(parseFloat(e.target.value))}
              />
            </div>
          </div>
          <div className='w-full mb-4'>
            <label htmlFor="cgf" className="block mb-2  mt-4 text-current font-bold">Seed</label>
            <div className="flex w-full items-center border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <input
                className="w-full p-[10px] outline-none"
                id="seed"
                name="seed"
                type="number"
                placeholder="Ex : 7"
                value={SEED}
                onChange={(e) => setSEED(parseFloat(e.target.value))}
              />
            </div>
          </div>
          <div className='w-full mb-4'>
            <label htmlFor="cgf" className="block mb-2  mt-4 text-current font-bold">Num Inference Steps : Jumlah Step Generate Gambar, Semakin banyak step, semakin baik gambarnya, tetapi juga membutuhkan waktu lebih lama untuk menghasilkannya. (max 200)</label>
            <div className="flex w-full items-center border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <input
                className="w-full p-[10px] outline-none"
                id="cgf"
                name="cgf"
                type="number"
                placeholder="Ex : 50"
                value={numSteps}
                onChange={(e) => setNumSteps(parseInt(e.target.value))}
              />
            </div>
          </div>
          <label htmlFor="image_url" className="block mb-2  mt-4 text-current font-bold">Input Your Photos</label>
          <div className="flex w-full items-center border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <input
              className="w-5/6 p-[10px] outline-none"
              id="image_url"
              name="image_url"
              type="file"
              placeholder="Choose a file"
              accept="image/*;capture=camera"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
            <label htmlFor="image_url" className="w-1/6 border-l-2 border-black bg-[#FDDC07] py-[16px] flex place-items-center justify-center">
              <RiCameraLine
              className="min-h-[24px] min-w-[24px] transition-transform ease-in-out"
            />
            </label>
          </div>
          <div className="relative w-full mt-4">
            <button
              disabled={!imageFile || loading}
              onClick={(e) => {
                e.preventDefault();
                generateImage();
              }}
              className={`flex cursor-pointer items-center border-4 border-black px-4 py-3 font-bold text-base shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none ${imageFile && prompt? "bg-[#FDDC07]" : "disabled bg-gray-500" }`}
            >
              {loading ? 'WAITING FOR MAGIC...' : 'GENERATE NOW!'}
            </button>
            <p className="text-xs mt-2">
              {`Waktu Proses (${numProses}/2) : ${(elapsedTime / 1000).toFixed(2)} seconds`}
            </p>
          </div>
        </div>
        <Error error={error} />

        {imageFaceSwap && (
              // eslint-disable-next-line @next/next/no-img-element
        <div className='mt-5 relative flex flex-col w-full items-center justify-center border-2 border-black bg-[#FFF2E9] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'>
          <div className="relative flex w-full overflow-x-hidden border-black bg-[#000] text-white font-bold pointer-events-none z-10">
            <div className="animate-marquee whitespace-nowrap py-2">
                <span className="text-lg tracking-[-.15em]">THIS IS YOU!</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">THIS IS YOU!</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">THIS IS YOU!</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">THIS IS YOU!</span><span className="mx-4">•</span>
            </div>
            <div className="absolute top-0 animate-marquee2 whitespace-nowrap py-2">
                <span className="text-lg tracking-[-.15em]">THIS IS YOU!</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">THIS IS YOU!</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">THIS IS YOU!</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">THIS IS YOU!</span><span className="mx-4">•</span>
            </div>
          </div>
          <div className="mx-auto p-4">
              <img src={imageFaceSwap.url} alt="" />
              {/* <p className='text-xs mt-1'>* Hold image to save</p> */}
          </div>
          <div className="absolute top-[-37px] right-[-23px] pointer-events-none z-30">
            <Image
              className="relative"
              src="/smile.png"
              alt="icon"
              width={80}
              height={80}
              priority
            />
          </div>

          <div className="relative flex w-full overflow-x-hidden border-black bg-[#000] text-white font-bold pointer-events-none z-10">
            <div className="animate-marquee3 whitespace-nowrap py-2">
                <span className="text-lg tracking-[-.15em]">hold image to save</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">hold image to save</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">hold image to save</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">hold image to save</span><span className="mx-4">•</span>
            </div>
            <div className="absolute top-0 animate-marquee4 whitespace-nowrap py-2">
                <span className="text-lg tracking-[-.15em]">hold image to save</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">hold image to save</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">hold image to save</span><span className="mx-4">•</span><span className="text-lg tracking-[-.15em]">hold image to save</span><span className="mx-4">•</span>
            </div>
          </div>
          {/* <div className="space-y-2">
            <h3 className="text-xl font-light">JSON Result</h3>
            <p className="text-sm text-current/80">
              {`Elapsed Time (seconds): ${(elapsedTime / 1000).toFixed(2)}`}
            </p>
            <pre className="text-sm bg-black/70 text-white/80 font-mono h-60 rounded whitespace-pre overflow-auto w-full">
              {result
                ? JSON.stringify(result, null, 2)
                : '// result pending...'}
            </pre>
            <pre className="text-sm bg-black/70 text-white/80 font-mono h-60 rounded whitespace-pre overflow-auto w-full">
              {resultFaceSwap
                ? JSON.stringify(resultFaceSwap, null, 2)
                : '// result pending...'}
            </pre>
          </div> */}

          {/* <div className="space-y-2">
            <h3 className="text-xl font-light">Logs</h3>
            <pre className="text-sm bg-black/70 text-white/80 font-mono h-60 rounded whitespace-pre overflow-auto w-full">
              {logs.filter(Boolean).join('\n')}
            </pre>
          </div> */}
        </div>
         )}

        <a href="https://zirolu.id/" target='_blank'>
          <div className="relative flex items-center justify-center mt-10">
            <Image
              className="relative"
              src="/developed.svg"
              alt="zirolu"
              width={168}
              height={20}
              priority
            />
          </div>
        </a>
      </div>

      <div className="fixed container bottom-0 flex w-full overflow-x-hidden border-b-4 border-t-4 border-black bg-[#F9B800] font-bold pointer-events-none z-30">
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
