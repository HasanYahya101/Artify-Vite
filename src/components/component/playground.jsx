import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Brush, Minus, Square, Circle, Eraser, Download, LineChartIcon, Slash, Pipette, PaintBucket, Type, Plus, Spline } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover-download";
import { Popover as PopoverArrow, PopoverContent as PopoverContentArrow, PopoverTrigger as PopoverTriggerArrow } from "@/components/ui/popover-sidebar";
import { Slider } from "@/components/ui/slider";

const CanvasDrawingApp = () => {
    const canvasRef = useRef(null);
    const [ctx, setCtx] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [thickness, setThickness] = useState([5]);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [savedImageData, setSavedImageData] = useState(null);

    const [selected, setSelected] = useState('pencil');
    const [shape, setShape] = useState('square');

    const [shapeOpen, setShapeOpen] = useState(false);
    const [thicknessOpen, setThicknessOpen] = useState(false);


    const [isHoveredJPEG, setIsHoveredJPEG] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
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

        if (selected === 'eraser') {
            ctx.strokeStyle = '#FFFFFF';
        }

        switch (selected) {
            case 'pencil':
            case 'eraser':
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.lineTo(x, y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x, y);
                break;
            case 'fill':
                floodFill(x, y, color);
                break;
            case 'color picker':
                const imageData_ = ctx.getImageData(x, y, 1, 1).data;
                if (imageData_[3] === 0) {
                    setColor('#FFFFFF'); // white
                } else {
                    const pickedColor = `rgb(${imageData_[0]}, ${imageData_[1]}, ${imageData_[2]})`;
                    setColor(pickedColor);
                }
                break;
            case 'shapes':
                switch (shape) {

                    case 'line':
                        ctx.putImageData(savedImageData, 0, 0);
                        ctx.beginPath();
                        ctx.moveTo(startX, startY);
                        ctx.lineTo(x, y);
                        ctx.stroke();
                        break;
                    case 'square':
                        ctx.putImageData(savedImageData, 0, 0);
                        ctx.beginPath();
                        ctx.rect(startX, startY, x - startX, y - startY);
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
                    case 'triangle':
                        ctx.putImageData(savedImageData, 0, 0);
                        ctx.beginPath();
                        ctx.moveTo((startX + x) / 2, startY);
                        ctx.lineTo(startX, y);
                        ctx.lineTo(x, y);
                        ctx.closePath();
                        ctx.stroke();
                        break;
                    case 'star':
                        ctx.putImageData(savedImageData, 0, 0);
                        drawStar(ctx, (startX + x) / 2, (startY + y) / 2, 5, Math.abs(x - startX) / 2);
                        break;
                    case 'hexagon':
                        ctx.putImageData(savedImageData, 0, 0);
                        ctx.beginPath();
                        const sideLength = Math.abs(x - startX);
                        const apothem = sideLength * Math.cos(Math.PI / 6);
                        for (let i = 0; i < 6; i++) {
                            const angle = i * (2 * Math.PI) / 6;
                            ctx.lineTo(startX + sideLength * Math.cos(angle), startY + sideLength * Math.sin(angle));
                        }
                        ctx.closePath();
                        ctx.stroke();
                        break;
                    case 'octagon':
                        ctx.putImageData(savedImageData, 0, 0);
                        ctx.beginPath();
                        const sideLengthOct = Math.abs(x - startX);
                        const apothemOct = sideLengthOct * Math.cos(Math.PI / 8);
                        for (let i = 0; i < 8; i++) {
                            const angle = i * (2 * Math.PI) / 8;
                            ctx.lineTo(startX + sideLengthOct * Math.cos(angle), startY + sideLengthOct * Math.sin(angle));
                        }
                        ctx.closePath();
                        ctx.stroke();
                        break;
                    case 'slash':
                        ctx.putImageData(savedImageData, 0, 0);
                        ctx.beginPath();
                        ctx.moveTo(startX, startY);
                        ctx.lineTo(x, y);
                        ctx.stroke();
                        break;
                    case 'curve':
                        ctx.putImageData(savedImageData, 0, 0);
                        drawCurve(ctx, startX, startY, x, y);
                        break;
                    default:
                        break;
                }
                break;
            case 'text':
                ctx.putImageData(savedImageData, 0, 0);
                ctx.font = '48px serif';
                ctx.fillText('Hello World!', x, y);
                break;
            default:
                break;
        }
    };

    const floodFill = (startX, startY, newColor) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const startPos = (startY * canvas.width + startX) * 4;
        const startR = imageData.data[startPos];
        const startG = imageData.data[startPos + 1];
        const startB = imageData.data[startPos + 2];
        const startA = imageData.data[startPos + 3];

        const newColorRgb = hexToRgb(newColor);
        const fillR = newColorRgb[0];
        const fillG = newColorRgb[1];
        const fillB = newColorRgb[2];
        const fillA = 255;

        if (startR === fillR && startG === fillG && startB === fillB && startA === fillA) {
            return; // No need to fill if the colors are the same
        }

        const pixelsToCheck = [startX, startY];
        const matchStartColor = (pixelPos) => {
            return (
                imageData.data[pixelPos] === startR &&
                imageData.data[pixelPos + 1] === startG &&
                imageData.data[pixelPos + 2] === startB &&
                imageData.data[pixelPos + 3] === startA
            );
        };

        while (pixelsToCheck.length > 0) {
            const y = pixelsToCheck.pop();
            const x = pixelsToCheck.pop();
            let pixelPos = (y * canvas.width + x) * 4;

            while (y >= 0 && matchStartColor(pixelPos)) {
                y--;
                pixelPos -= canvas.width * 4;
            }
            pixelPos += canvas.width * 4;
            y++;

            let reachLeft = false;
            let reachRight = false;
            while (y < canvas.height - 1 && matchStartColor(pixelPos)) {
                colorPixel(imageData, pixelPos, [fillR, fillG, fillB, fillA]);
                if (x > 0) {
                    if (matchStartColor(pixelPos - 4)) {
                        if (!reachLeft) {
                            pixelsToCheck.push(x - 1, y);
                            reachLeft = true;
                        }
                    } else if (reachLeft) {
                        reachLeft = false;
                    }
                }
                if (x < canvas.width - 1) {
                    if (matchStartColor(pixelPos + 4)) {
                        if (!reachRight) {
                            pixelsToCheck.push(x + 1, y);
                            reachRight = true;
                        }
                    } else if (reachRight) {
                        reachRight = false;
                    }
                }
                pixelPos += canvas.width * 4;
                y++;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    };

    const getPixelColor = (imageData, x, y) => {
        const pixelPos = (y * imageData.width + x) * 4;
        return [
            imageData.data[pixelPos],
            imageData.data[pixelPos + 1],
            imageData.data[pixelPos + 2],
            imageData.data[pixelPos + 3]
        ];
    };

    const colorsMatch = (color1, color2) => {
        return color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2] && color1[3] === color2[3];
    };

    const colorPixel = (imageData, pixelPos, color) => {
        imageData.data[pixelPos] = color[0];
        imageData.data[pixelPos + 1] = color[1];
        imageData.data[pixelPos + 2] = color[2];
        imageData.data[pixelPos + 3] = color[3];
    };

    const drawStar = (ctx, centerX, centerY, points, outerRadius) => {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - outerRadius);

        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : outerRadius / 2;
            const angle = (Math.PI * 2 * i) / (points * 2);
            const x = centerX + radius * Math.sin(angle);
            const y = centerY - radius * Math.cos(angle);
            ctx.lineTo(x, y);
        }

        ctx.closePath();
        ctx.stroke();
    };

    const drawCurve = (ctx, startX, startY, endX, endY) => {
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        const controlX = midX + (endY - startY) / 4;
        const controlY = midY - (endX - startX) / 4;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(controlX, controlY, endX, endY);
        ctx.stroke();
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

    const colorInputRef = useRef(null);

    const handleButtonClick = () => {
        colorInputRef.current.click();
    };

    const handleColorChange = (e) => {
        setColor(e.target.value);
    };


    const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
    }

    const [textHover, setTextHover] = useState(false);
    const [newHover, setNewHover] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <aside className="fixed top-4 left-4 ml-2 z-10 h-[calc(100vh-2rem)] w-16 rounded-lg bg-background border shadow-xl flex flex-col object-contain justify-start min-h-[140px]">
                <div className="p-4 border-b flex items-center justify-center">
                    <Avatar size="md">
                        <AvatarImage src="https://github.com/HasanYahya101.png" />
                        <AvatarFallback className="bg-gray-100 border"
                        >HY</AvatarFallback>
                    </Avatar>
                </div>
                <div className='overflow-auto'
                    style={{ scrollbarWidth: 'none' }}
                >
                    <div className="my-1.5 px-4 flex flex-col items-center justify-center mt-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button size="icon" variant={selected === 'pencil' ? 'secondary' : 'ghost'}
                                        onClick={() => setSelected('pencil')}
                                    >
                                        <Pencil className="w-6 h-6" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <span className='text-gray-500'>Pencil</span>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="my-1.5 px-4 flex flex-col items-center justify-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button variant={selected === 'eraser' ? 'secondary' : 'ghost'} size="icon"
                                        onClick={() => setSelected('eraser')}
                                    >
                                        <Eraser className="w-6 h-6" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <span className='text-gray-500'>Eraser</span>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="my-1.5 px-4 flex flex-col items-center justify-center">
                        <TooltipProvider>
                            <Tooltip>
                                <PopoverArrow open={shapeOpen} onOpenChange={setShapeOpen}
                                >
                                    <PopoverTriggerArrow>
                                        <TooltipTrigger>
                                            <Button variant={selected === 'shapes' ? 'secondary' : 'ghost'} size="icon"
                                                onClick={() => setSelected('shapes')}
                                            >
                                                {shape === 'square'
                                                    ? <SquareIcon className="w-6 h-6" />
                                                    : shape === 'circle'
                                                        ? <CircleIcon className="w-6 h-6" />
                                                        : shape === 'triangle'
                                                            ? <TriangleIcon className="w-6 h-6" />
                                                            : shape === 'star'
                                                                ? <StarIcon className="w-6 h-6" />
                                                                : shape === 'hexagon'
                                                                    ? <HexagonIcon className="w-6 h-6" />
                                                                    : shape === 'octagon'
                                                                        ? <OctagonIcon className="w-6 h-6" />
                                                                        : shape === 'slash' ?
                                                                            <Slash className="w-6 h-6" />
                                                                            : shape === 'curve' ?
                                                                                <Spline className="w-6 h-6" />
                                                                                : null
                                                }
                                            </Button>
                                        </TooltipTrigger>
                                    </PopoverTriggerArrow>
                                    <PopoverContentArrow className="" side="right"
                                        align="center" sideOffset={6}
                                    >
                                        <div className="flex flex-col h-full">
                                            <div className="p-4 border-b">
                                                <h2 className="text-lg font-semibold">Select Shapes</h2>
                                            </div>
                                            <div className="flex-1 overflow-auto p-3 space-y-1 justify-center">
                                                <div>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        <div className="p-1">
                                                            <Button variant={shape === 'square' ? 'secondary' : 'ghost'} size="icon"
                                                                onClick={() => { setShape('square'); setShapeOpen(false) }}
                                                            >
                                                                <SquareIcon className="w-6 h-6" />
                                                            </Button>
                                                        </div>
                                                        <div className="p-1">
                                                            <Button variant={shape === 'circle' ? 'secondary' : 'ghost'} size="icon"
                                                                onClick={() => { setShape('circle'); setShapeOpen(false) }}
                                                            >
                                                                <CircleIcon className="w-6 h-6" />
                                                            </Button>
                                                        </div>
                                                        <div className="p-1">
                                                            <Button variant={shape === 'triangle' ? 'secondary' : 'ghost'} size="icon"
                                                                onClick={() => { setShape('triangle'); setShapeOpen(false) }}
                                                            >
                                                                <TriangleIcon className="w-6 h-6" />
                                                            </Button>
                                                        </div>
                                                        <div className="p-1">
                                                            <Button variant={shape === 'star' ? 'secondary' : 'ghost'} size="icon"
                                                                onClick={() => { setShape('star'); setShapeOpen(false) }}
                                                            >
                                                                <StarIcon className="w-6 h-6" />
                                                            </Button>
                                                        </div>
                                                        <div className="p-1">
                                                            <Button variant={shape === 'hexagon' ? 'secondary' : 'ghost'} size="icon"
                                                                onClick={() => { setShape('hexagon'); setShapeOpen(false) }}
                                                            >
                                                                <HexagonIcon className="w-6 h-6" />
                                                            </Button>
                                                        </div>
                                                        <div className="p-1">
                                                            <Button variant={shape === 'octagon' ? 'secondary' : 'ghost'} size="icon"
                                                                onClick={() => { setShape('octagon'); setShapeOpen(false) }}
                                                            >
                                                                <OctagonIcon className="w-6 h-6" />
                                                            </Button>
                                                        </div>
                                                        <div className="p-1">
                                                            <Button variant={shape === 'slash' ? 'secondary' : 'ghost'} size="icon"
                                                                onClick={() => { setShape('slash'); setShapeOpen(false) }}
                                                            >
                                                                <Slash className="w-6 h-6" />
                                                            </Button>
                                                        </div>
                                                        <div className="p-1">
                                                            <Button variant={shape === 'curve' ? 'secondary' : 'ghost'} size="icon"
                                                                onClick={() => { setShape('curve'); setShapeOpen(false) }}
                                                            >
                                                                <Spline className="w-6 h-6" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </PopoverContentArrow>
                                </PopoverArrow>
                                <TooltipContent>
                                    <span className='text-gray-500'>Shapes</span>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="my-1.5 px-4 flex flex-col items-center justify-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button variant={selected === 'color picker' ? 'secondary' : 'ghost'} size="icon"
                                        onClick={() => setSelected('color picker')}
                                    >
                                        <Pipette className="w-6 h-6" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <span className='text-gray-500'>Color Picker</span>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="my-1.5 px-4 flex flex-col items-center justify-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button variant={selected === 'fill' ? 'secondary' : 'ghost'} size="icon"
                                        onClick={() => setSelected('fill')}
                                    >
                                        <PaintBucket className="w-6 h-6" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <span className='text-gray-500'>Fill</span>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="my-1.5 px-4 flex flex-col items-center justify-center">
                        <TooltipProvider>
                            <Tooltip>
                                <PopoverArrow open={thicknessOpen} onOpenChange={setThicknessOpen}
                                >
                                    <PopoverTriggerArrow>
                                        <TooltipTrigger>
                                            <Button variant="ghost" size="icon" className="group">
                                                <div className="bg-muted rounded-full group-hover:bg-white" style={{ width: `${thickness}px`, height: `${thickness}px` }} />
                                            </Button>
                                        </TooltipTrigger>
                                    </PopoverTriggerArrow>
                                    <PopoverContentArrow className="" side="right"
                                        align="center" sideOffset={3}
                                    >
                                        <div className="flex flex-col h-full">
                                            <div className="p-4 border-b">
                                                <h2 className="text-lg font-semibold">Select Thickness</h2>
                                            </div>
                                            <div className="flex-1 overflow-auto space-y-1 justify-center">
                                                <div className='p-3'>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        <div className="p-1"
                                                            onClick={() => setThickness(thickness => [thickness[0] === 5 ? 5 : 5])}
                                                        >
                                                            <Button variant={thickness[0] === 5 ? 'secondary' : 'ghost'} size="icon" className="group">
                                                                <div className={`w-6 h-6 rounded-full ${thickness[0] === 5 ? 'bg-black' : 'bg-muted group-hover:bg-white'}`} style={{ width: "5px", height: "5px" }} />
                                                            </Button>
                                                        </div>
                                                        <div className="p-1">
                                                            <Button variant={thickness[0] === 9 ? 'secondary' : 'ghost'} size="icon" className="group"
                                                                onClick={() => setThickness(thickness => [thickness[0] === 9 ? 9 : 9])}
                                                            >
                                                                <div className={`w-6 h-6 rounded-full ${thickness[0] === 9 ? 'bg-black' : 'bg-muted group-hover:bg-white'}`} style={{ width: "9px", height: "9px" }} />
                                                            </Button>
                                                        </div>
                                                        <div className="p-1">
                                                            <Button variant={thickness[0] === 12 ? 'secondary' : 'ghost'} size="icon" className="group"
                                                                onClick={() => setThickness(thickness => [thickness[0] === 12 ? 12 : 12])}
                                                            >
                                                                <div className={`w-6 h-6 rounded-full ${thickness[0] === 12 ? 'bg-black' : 'bg-muted group-hover:bg-white'}`} style={{ width: "12px", height: "12px" }} />
                                                            </Button>
                                                        </div>
                                                        <div className="p-1">
                                                            <Button variant={thickness[0] === 18 ? 'secondary' : 'ghost'} size="icon" className="group"
                                                                onClick={() => setThickness(thickness => [thickness[0] === 18 ? 18 : 18])}
                                                            >
                                                                <div className={`w-6 h-6 rounded-full ${thickness[0] === 18 ? 'bg-black' : 'bg-muted group-hover:bg-white'}`} style={{ width: "18px", height: "18px" }} />
                                                            </Button>
                                                        </div>
                                                        <div className="p-1">
                                                            <Button variant={thickness[0] === 24 ? 'secondary' : 'ghost'} size="icon" className="group"
                                                                onClick={() => setThickness(thickness => [thickness[0] === 24 ? 24 : 24])}
                                                            >
                                                                <div className={`w-6 h-6 rounded-full ${thickness[0] === 24 ? 'bg-black' : 'bg-muted group-hover:bg-white'}`} style={{ width: "24px", height: "24px" }} />
                                                            </Button>
                                                        </div>
                                                        <div className="p-1">
                                                            <Button variant={thickness[0] === 28 ? 'secondary' : 'ghost'} size="icon" className="group"
                                                                onClick={() => setThickness(thickness => [thickness[0] === 28 ? 28 : 28])}
                                                            >
                                                                <div className={`w-6 h-6 rounded-full ${thickness[0] === 28 ? 'bg-black' : 'bg-muted group-hover:bg-white'}`} style={{ width: "28px", height: "28px" }} />
                                                            </Button>
                                                        </div>
                                                        <div className="p-1">
                                                            <Button variant={thickness[0] === 30 ? 'secondary' : 'ghost'} size="icon" className="group"
                                                                onClick={() => setThickness(thickness => [thickness[0] === 30 ? 30 : 30])}
                                                            >
                                                                <div className={`w-6 h-6 rounded-full ${thickness[0] === 30 ? 'bg-black' : 'bg-muted group-hover:bg-white'}`} style={{ width: "30px", height: "30px" }} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/*Slider for custom thickness*/}
                                                <div className="space-y-4 p-3">
                                                    <div className="flex justify-between items-center mb-3 mx-1">
                                                        <span className="text-sm font-medium">Custom Size</span>
                                                        <span className="text-sm text-muted-foreground">{thickness}px</span>
                                                    </div>
                                                    <Slider
                                                        min={5}
                                                        max={30}
                                                        step={1}
                                                        value={[thickness]}
                                                        onValueChange={(value) => setThickness(value)}
                                                        className="hover:cursor-move"
                                                    />
                                                </div>
                                                <div className="border-t" />
                                                <div className="flex justify-center items-center space-x-3 p-1">
                                                    <span className="text-sm font-medium">Preview:</span>
                                                    <div
                                                        className="rounded-full bg-black border mt-1"
                                                        style={{ width: `${thickness}px`, height: `${thickness}px` }}
                                                    />
                                                </div>
                                                <div className='space-y-6 flex-1'></div>
                                            </div>
                                            <div className='border-t'>
                                            </div>
                                        </div>
                                    </PopoverContentArrow>
                                </PopoverArrow>
                                <TooltipContent>
                                    <span className='text-gray-500'>Thickness
                                    </span>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="my-1.5 px-4 flex flex-col items-center justify-center mb-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button variant="ghost" size="icon"
                                        onClick={() => handleButtonClick()}
                                    >
                                        <div className='h-6 w-6 rounded-full relative overflow-hidden border-black border'
                                            style={{ backgroundColor: color }}
                                        >
                                            <input
                                                type="color"
                                                ref={colorInputRef}
                                                onChange={handleColorChange}
                                                style={{ visibility: 'hidden' }}
                                                value={color}
                                                className='absolute rounded-full'
                                            />
                                        </div>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <span className='text-gray-500'>Color
                                    </span>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <div className='mt-auto flex-1' />
                <div className="p-4 border-t flex justify-center">
                    <TooltipProvider>
                        <Tooltip>
                            <Popover>
                                <PopoverTrigger>
                                    <TooltipTrigger>
                                        <Button variant="outline" size="sm">
                                            <Download size={20} />
                                        </Button>
                                    </TooltipTrigger>
                                </PopoverTrigger>
                                <PopoverContent className='mx-4 mb-0.5' side="top"
                                    hoverJPEG={isHoveredJPEG}
                                >
                                    <div className="grid grid-rows-2">
                                        <div className="items-center text-center justify-center p-2 border rounded-t cursor-pointer hover:bg-gray-100 z-10">
                                            Download PNG
                                        </div>
                                        <div className="items-center text-center justify-center p-2 border-t border-l border-r rounded-b cursor-pointer hover:bg-gray-100 z-10"
                                            onMouseEnter={() => setIsHoveredJPEG(true)}
                                            onMouseLeave={() => setIsHoveredJPEG(false)}
                                        >
                                            Download JPEG
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <TooltipContent>
                                <span className='text-gray-500'>Export
                                </span>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </aside>

            <div
                className="h-screen max-h-screen max-w-[100vw] bg-white self-center relative w-screen border-black overflow-hidden cursor-crosshair"
            >
                <canvas
                    className="w-[100vw] h-screen bg-white cursor-crosshair"
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={stopDrawing}
                    onMouseOut={stopDrawing}
                    onMouseMove={draw}
                    onClick={draw}
                />
            </div>
            <div className="fixed bottom-24 right-9 flex flex-col gap-2">
                <button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-3 shadow-lg transition-all duration-300 flex items-center group hover:pr-6"
                    onMouseEnter={() => setTextHover(true)}
                    onMouseLeave={() => setTextHover(false)}
                >
                    <Type size={24} />
                    {textHover === true ?
                        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ml-1">
                            Text
                        </span>
                        : null}
                </button>
            </div>
            <div className="fixed bottom-9 right-9 flex flex-col gap-2">
                <button className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg transition-all duration-300 flex items-center group hover:pr-6"
                    onMouseEnter={() => setNewHover(true)}
                    onMouseLeave={() => setNewHover(false)}
                >
                    <Plus size={24} />
                    {newHover === true ?
                        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ml-1">
                            New
                        </span>
                        : null}
                </button>
            </div>
        </div >
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