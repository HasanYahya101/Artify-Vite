/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/paumjhoQJw9
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import { Button } from "@/components/ui/button"

export function temp() {
  return (
    (<div className="flex h-screen w-full">
      <aside
        className="fixed top-4 left-4 z-10 h-[calc(100vh-2rem)] w-64 rounded-lg bg-background border shadow-lg">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Drawing Tools</h2>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Shapes</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="ghost" size="icon">
                  <SquareIcon className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon">
                  <CircleIcon className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon">
                  <TriangleIcon className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon">
                  <StarIcon className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon">
                  <HexagonIcon className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon">
                  <OctagonIcon className="w-6 h-6" />
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Colors</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="ghost" size="icon" className="bg-red-500 text-white">
                  <PaletteIcon className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon" className="bg-green-500 text-white">
                  <PaletteIcon className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon" className="bg-blue-500 text-white">
                  <PaletteIcon className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon" className="bg-yellow-500 text-white">
                  <PaletteIcon className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon" className="bg-purple-500 text-white">
                  <PaletteIcon className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon" className="bg-pink-500 text-white">
                  <PaletteIcon className="w-6 h-6" />
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Pen Thickness</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="ghost" size="icon">
                  <div className="w-6 h-6 bg-muted rounded-full" />
                </Button>
                <Button variant="ghost" size="icon">
                  <div
                    className="w-6 h-6 bg-muted rounded-full"
                    style={{ width: "12px", height: "12px" }} />
                </Button>
                <Button variant="ghost" size="icon">
                  <div
                    className="w-6 h-6 bg-muted rounded-full"
                    style={{ width: "18px", height: "18px" }} />
                </Button>
                <Button variant="ghost" size="icon">
                  <div
                    className="w-6 h-6 bg-muted rounded-full"
                    style={{ width: "24px", height: "24px" }} />
                </Button>
                <Button variant="ghost" size="icon">
                  <div
                    className="w-6 h-6 bg-muted rounded-full"
                    style={{ width: "30px", height: "30px" }} />
                </Button>
                <Button variant="ghost" size="icon">
                  <div
                    className="w-6 h-6 bg-muted rounded-full"
                    style={{ width: "36px", height: "36px" }} />
                </Button>
              </div>
            </div>
          </div>
          <div className="p-4 border-t flex justify-between items-center">
            <Button variant="outline" size="sm">
              Clear Canvas
            </Button>
            <Button size="sm">Save Drawing</Button>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <canvas
          id="drawing-canvas"
          className="w-[800px] h-[600px] border rounded-lg shadow-lg" />
      </div>
    </div>)
  );
}

function CircleIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
    </svg>)
  );
}


function HexagonIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>)
  );
}


function OctagonIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <polygon
        points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
    </svg>)
  );
}


function PaletteIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path
        d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>)
  );
}


function SquareIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
    </svg>)
  );
}


function StarIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>)
  );
}


function TriangleIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    </svg>)
  );
}