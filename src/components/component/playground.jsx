import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Brush, Minus, Square, Circle, Eraser, Download, LineChartIcon, Slash, Pipette, PaintBucket } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CanvasDrawingApp = () => {
    const canvasRef = useRef(null);
    const [ctx, setCtx] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState('pencil');
    const [color, setColor] = useState('#000000');
    const [thickness, setThickness] = useState(2);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [savedImageData, setSavedImageData] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth - 80; // Adjust for left sidebar
        canvas.height = window.innerHeight;
        const context = canvas.getContext('2d');
        setCtx(context);
    }, []);

    const startDrawing = (e) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        ctx.beginPath();
    };

    const draw = (e) => {
        if (!isDrawing) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;

        if (tool === 'eraser') {
            ctx.strokeStyle = '#FFFFFF';
        }

        switch (tool) {
            case 'pencil':
            case 'brush':
            case 'eraser':
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.lineTo(x, y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x, y);
                break;
            case 'line':
                ctx.putImageData(savedImageData, 0, 0);
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(x, y);
                ctx.stroke();
                break;
            case 'rectangle':
                ctx.putImageData(savedImageData, 0, 0);
                ctx.beginPath();
                ctx.rect(startX, startY, x - startX, y - startY);
                ctx.stroke();
                break;
            case 'circle':
                ctx.putImageData(savedImageData, 0, 0);
                ctx.beginPath();
                const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
                ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
                ctx.stroke();
                break;
            default:
                break;
        }
    };

    const handleMouseDown = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        setStartX(e.clientX - rect.left);
        setStartY(e.clientY - rect.top);
        setSavedImageData(ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
        startDrawing(e);
    };

    const exportImage = (format) => {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL(`image/${format}`);
        const link = document.createElement('a');
        link.download = `drawing.${format}`;
        link.href = dataURL;
        link.click();
    };

    return (
        <div className="flex min-h-screen">
            <aside className="fixed top-4 left-4 z-10 h-[calc(100vh-2rem)] w-16 rounded-lg bg-background border shadow-lg flex flex-col object-contain">
                <div className="p-4 border-b flex items-center justify-center">
                    <Avatar size="md">
                        <AvatarImage src="https://github.com/HasanYahya101.png" />
                        <AvatarFallback className="bg-gray-100"
                        >HY</AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex-1 my-1 px-4 flex flex-col items-center justify-center">
                    <Button variant="ghost" size="icon">
                        <SquareIcon className="w-6 h-6" />
                    </Button>
                </div>
                <div className="flex-1 my-1 px-4 flex flex-col items-center justify-center">
                    <Button variant="ghost" size="icon">
                        <Pencil className="w-6 h-6" />
                    </Button>
                </div>
                <div className="flex-1 my-1 px-4 flex flex-col items-center justify-center">
                    <Button variant="ghost" size="icon">
                        <Eraser className="w-6 h-6" />
                    </Button>
                </div>
                {/*div for color picker*/}
                <div className="flex-1 my-1 px-4 flex flex-col items-center justify-center">
                    <Button variant="ghost" size="icon">
                        <div className='h-6 w-6 bg-black rounded-full' />
                    </Button>
                </div>
                <div className="flex-1 my-1 px-4 flex flex-col items-center justify-center">
                    <Button variant="ghost" size="icon">
                        <Slash className="w-6 h-6" />
                    </Button>
                </div>
                <div className="flex-1 my-1 px-4 flex flex-col items-center justify-center">
                    <Button variant="ghost" size="icon">
                        <Pipette className="w-6 h-6" />
                    </Button>
                </div>
                <div className="flex-1 my-1 px-4 flex flex-col items-center justify-center">
                    <Button variant="ghost" size="icon">
                        <PaintBucket className="w-6 h-6" />
                    </Button>
                </div>
                <div className='mt-auto flex-1' />
                <div className="p-4 border-t flex justify-center">
                    <Button variant="outline" size="sm">
                        <Download size={20} />
                    </Button>
                </div>
            </aside>

            <div className="ml-40 rounded-md border-black h-[70vh] w-[50vh] p-10">
                <canvas className="border border-black rounded-md h-[70vh] w-[50vh]"
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={stopDrawing}
                    onMouseOut={stopDrawing}
                    onMouseMove={draw}
                />
            </div>
        </div>
    );
};

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


export default CanvasDrawingApp;