import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Eraser, Download, Slash, Pipette, PaintBucket, Type, Plus, Spline, Undo, Redo, ALargeSmall, Bold, Italic, Hand, Command, ArrowBigUp, GitCommitHorizontal, User, Star, Monitor, BookMarked, GitCompare, Brush, Pen } from 'lucide-react';
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Toggle } from "@/components/ui/toggle";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card-profile";
import {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";

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
    const [penciltype, setPencilType] = useState('pencil');

    const [shapeOpen, setShapeOpen] = useState(false);
    const [thicknessOpen, setThicknessOpen] = useState(false);


    const [isHoveredJPEG, setIsHoveredJPEG] = useState(false);
    const [font, setFont] = useState('sera');

    const [isMac, setIsMac] = useState(false);

    useEffect(() => {
        setIsMac(window.navigator.platform.toUpperCase().indexOf('MAC') >= 0);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (context) {
            context.imageSmoothingEnabled = false;
            context.mozImageSmoothingEnabled = false;
            context.webkitImageSmoothingEnabled = false;
            context.msImageSmoothingEnabled = false;
        }
        setCtx(context);
    }, []);

    const startDrawing = (e) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            ctx.beginPath();
            saveState();
        }
    };

    useEffect(() => {
        if (ctx) {
            clearCanvas();
        }
    }, [ctx]);

    const [inputValue, setInputValue] = useState('Aa');
    const [alertOpen, setAlertOpen] = useState(false);

    const handleConfirm = () => {
        if (inputValue === '') {
            // throw error toast
            toast("Error: The input field cannot be empty.", {
                description: "Please enter some text to continue.",
                actionButton: {
                    label: "Close",
                    onClick: () => toast.dismiss(),
                },
            });
            setAlertOpen(true);
            return;
        }
        setSelected('text');
        setAlertOpen(false);
        // throw toast
        toast("Text added successfully!", {
            description: "You can now add text to the canvas.",
            action: {
                label: "Close",
                onClick: () => toast.dismiss(),
            },
        });
        return;
    };

    const fonts = {
        sera: 'Playwrite ID',
        block: 'Tiny5',
        oswald: 'Oswald',
        roboto: 'Roboto',
        playwrite: "Playwrite AU NSW",
        arsenal: 'Arsenal SC',
        anton: 'Anton SC',
        cursive: 'Cedarville Cursive',
    };

    const draw = (e) => {
        if (!isDrawing) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = thickness;

        if (selected === 'eraser') {
            ctx.strokeStyle = '#FFFFFF';
        }

        switch (selected) {
            case 'pencil':
                switch (penciltype) {
                    case 'pencil':
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        ctx.lineTo(x, y);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        break;
                    case 'brush':
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        ctx.strokeStyle = color;
                        var dotSize = 1;
                        const spread = thickness * 1;
                        var amount = 1;
                        if (thickness <= 17) {
                            amount = thickness;
                        }
                        else {
                            amount = thickness * 2;
                        }
                        for (let i = 0; i < amount; i++) {
                            const offsetX = Math.random() * spread - spread / 2;
                            const offsetY = Math.random() * spread - spread / 2;
                            ctx.beginPath();
                            ctx.arc(x + offsetX, y + offsetY, dotSize, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        break;
                    case 'pen':
                        // draw freehand
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        ctx.lineTo(x, y);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        break;
                    default:
                        break;
                }
                break;
            case 'eraser':
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.lineTo(x, y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x, y);
                break;
            case 'text':
                ctx.fillStyle = color;
                ctx.font = `${bold ? 'bold' : ''} ${italic ? 'italic' : ''} ${fontSize}px ${fonts[font]}`;
                ctx.fillText(inputValue, x, y);
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
            default:
                break;
        }
    };

    const floodFill = (startX, startY, newColor) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
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
            var y = pixelsToCheck.pop();
            var x = pixelsToCheck.pop();
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

    const exportImagePNG = (format) => {
        const canvas_ = canvasRef.current;
        const tempCanvas = document.createElement('canvas'); // Create a temporary canvas
        tempCanvas.width = canvas_.width;
        tempCanvas.height = canvas_.height;
        const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
        tempCtx.drawImage(canvas_, 0, 0);
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
            const r = imageData.data[i];
            const g = imageData.data[i + 1];
            const b = imageData.data[i + 2];
            const a = imageData.data[i + 3];

            if (r > 240 && g > 240 && b > 240) {
                imageData.data[i + 3] = 255 - ((r + g + b) / 3);
            }
        }
        tempCtx.putImageData(imageData, 0, 0);
        const dataURL = tempCanvas.toDataURL(`image/${format}`);
        const link = document.createElement('a');
        link.download = `drawing.${format}`;
        link.href = dataURL;
        link.click();
        tempCanvas.remove();
    };

    const exportImageJPEG = (format) => {
        const canvas_ = canvasRef.current;
        const tempCanvas = document.createElement('canvas'); // Create a temporary canvas
        tempCanvas.width = canvas_.width;
        tempCanvas.height = canvas_.height;
        const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
        tempCtx.drawImage(canvas_, 0, 0);
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.putImageData(imageData, 0, 0);
        const dataURL = tempCanvas.toDataURL(`image/${format}`);
        const link = document.createElement('a');

        link.download = `drawing.${format}`;
        link.setAttribute('href', dataURL);
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
    const [downloadOpen, setDownloadOpen] = useState(false);

    // keep a list of states for undo and redo
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        setCtx(context);

        // Save initial blank state
        const initialState = context.getImageData(0, 0, canvas.width, canvas.height);
        // set will read frequently to true
        setHistory([initialState]);
        setHistoryIndex(0);
    }, []);

    const saveState = () => {
        if (!ctx) return;

        const canvas = canvasRef.current;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Remove any future states
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(imageData);

        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const undo = () => {

        if (!undoDisabled) {
            setHistoryIndex(prevIndex => {
                const newIndex = prevIndex - 1;
                ctx.putImageData(history[newIndex], 0, 0);
                return newIndex;
            });
        }
    };

    const redo = () => {
        if (!redoDisabled) {
            setHistoryIndex(prevIndex => {
                const newIndex = prevIndex + 1;
                ctx.putImageData(history[newIndex], 0, 0);
                return newIndex;
            });
        }
    };

    const [OverlaysHiden, setOverlaysHiden] = useState(false);

    const undo_shortcut = isMac ? '⌘Z' : 'Ctrl+Z';
    const redo_shortcut = isMac ? '⇧⌘Z' : 'Ctrl+Shift+Z';
    const add_text_shortcut = isMac ? '⌘I' : 'Ctrl+I';
    const clear_shortcut = isMac ? '⌘B' : 'Ctrl+B';
    const pencil_shortcut = isMac ? '⌘Q' : 'Ctrl+Q';
    const eraser_shortcut = isMac ? '⌘E' : 'Ctrl+E';
    const shapes_shortcut = isMac ? '⌘S' : 'Ctrl+S';
    const fill_shortcut = isMac ? '⌘F' : 'Ctrl+F';
    const color_picker_shortcut = isMac ? '⌘K' : 'Ctrl+K';
    const overlays_shortcut = isMac ? '⌘M' : 'Ctrl+M';

    // do undo with ctrl z and redo with ctrl shift z
    const handleKeyDown = (e) => {
        const ctrlKey = e.ctrlKey || e.metaKey;
        const shiftKey = e.shiftKey;
        const zKey = e.key === 'z' || e.key === 'Z';
        const iKey = e.key === 'i' || e.key === 'I';
        const bKey = e.key === 'b' || e.key === 'B';
        const qKey = e.key === 'q' || e.key === 'Q';
        const eKey = e.key === 'e' || e.key === 'E';
        const sKey = e.key === 's' || e.key === 'S';
        const fKey = e.key === 'f' || e.key === 'F';
        const kKey = e.key === 'k' || e.key === 'K';
        const mKey = e.key === 'm' || e.key === 'M';

        if (ctrlKey && zKey && shiftKey) {
            e.preventDefault();
            redo();
        } else if (ctrlKey && zKey) {
            e.preventDefault();
            undo();
        }
        else if (ctrlKey && iKey) {
            e.preventDefault();
            setAlertOpen(true);
        }
        else if (ctrlKey && bKey) {
            e.preventDefault();
            clearCanvas();
        }
        else if (ctrlKey && qKey) {
            e.preventDefault();
            setSelected('pencil');
        }
        else if (ctrlKey && eKey) {
            e.preventDefault();
            setSelected('eraser');
        }
        else if (ctrlKey && sKey) {
            e.preventDefault();
            setSelected('shapes');
        }
        else if (ctrlKey && fKey) {
            e.preventDefault();
            setSelected('fill');
        }
        else if (ctrlKey && kKey) {
            e.preventDefault();
            setSelected('color picker');
        }
        else if (ctrlKey && mKey) {
            e.preventDefault();
            setOverlaysHiden(prev => !prev);
        }
    };

    const [undoDisabled, setUndoDisabled] = useState(true);
    const [redoDisabled, setRedoDisabled] = useState(true);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [ctx, history, historyIndex, undoDisabled, redoDisabled]); // All the dependencies need to be added here

    const [time, setTime] = useState(0);

    useEffect(() => {
        // If the historyIndex is at the start, disable undo
        if (historyIndex === 0) {
            setUndoDisabled(true);
        } else {
            setUndoDisabled(false);
        }

        // If the historyIndex is at the end, disable redo
        if (historyIndex === history.length - 1) {
            setRedoDisabled(true);
        } else {
            setRedoDisabled(false);
        }

    }, [history, historyIndex]);

    const [fontOpen, setFontOpen] = useState(false);
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [fontSize, setFontSize] = useState([16]); // pixels

    const clearCanvas = () => {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        // add the state to history
        if (time !== 0) {
            saveState();
        }
        else {
            if (history.length !== 0) {
                setTime(1);
            }
        }
    };

    // Touch events for mobile
    const handleTouchStart = (e) => {
        e.preventDefault();
        handleMouseDown(e.touches[0]);
    };

    const handleTouchMove = (e) => {
        e.preventDefault();
        draw(e.touches[0]);
    };

    const handleTouchEnd = (e) => {
        e.preventDefault();
        stopDrawing();
    };

    const [height, setHeight] = useState(window.innerHeight - 40); // Initial height
    const [isDragging, setIsDragging] = useState(false);
    const asideRef = useRef(null);
    const startYRef = useRef(0);
    const startHeightRef = useRef(0);
    const minHeight = 140; // Minimum height

    const handleMouseDownResize = (e) => {
        e.preventDefault();
        setIsDragging(true);
        startYRef.current = e.clientY;
        startHeightRef.current = height;
    };

    const handleMouseMoveResize = (e) => {
        if (!isDragging) return;

        const deltaY = e.clientY - startYRef.current;
        const newHeight = Math.max(minHeight, startHeightRef.current + deltaY);

        setHeight(Math.min(newHeight, window.innerHeight - 40));
    };

    const handleMouseUpResize = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMoveResize);
            window.addEventListener('mouseup', handleMouseUpResize);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMoveResize);
            window.removeEventListener('mouseup', handleMouseUpResize);
        };
    }, [isDragging]);

    const [pencilPopoverOpen, setPencilPopoverOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Undo and redo */}
            <div className={`fixed top-7 right-7 ${OverlaysHiden === true ? 'z-0' : 'z-10'} rounded-md bg-white shadow-lg border`}>
                <div className="flex flex-col">
                    <div className='p-1'>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button variant="ghost" size="icon" className={`h-8 w-8 ${undoDisabled === true ? 'cursor-not-allowed' : ''}`}
                                        onClick={undo}
                                        disabled={undoDisabled}
                                    >
                                        <Undo size={20} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className='mr-2 p-1 px-2 py-1.5'>
                                    <div className="flex items-center justify-center">
                                        <span className='text-gray-500
                                        '>Undo</span>
                                        <div className="w-[6px] h-[6px] bg-gray-500 rounded-full ml-2"></div>
                                        {!isMac ? (
                                            <kbd className="ml-2 px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Ctrl+Z</kbd>
                                        ) : (
                                            <kbd className="flex ml-2 px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                                                <Command className='h-3 w-3 self-center' />
                                                <span className='ml-0.5'>Z</span>
                                            </kbd>
                                        )}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className='border-b'></div>
                    <div className='p-1'>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button variant="ghost" size="icon" className={`h-8 w-8 ${redoDisabled === true ? 'cursor-not-allowed' : ''}`}
                                        onClick={redo}
                                        disabled={redoDisabled}
                                    >
                                        <Redo size={20} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className='mr-2 p-1 px-2 py-1.5'
                                >
                                    <div className="flex items-center justify-center">
                                        <span className='text-gray-500'>Redo</span>
                                        <div className="w-[6px] h-[6px] bg-gray-500 rounded-full ml-2"></div>
                                        {!isMac ? (
                                            <kbd className="ml-2 px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Ctrl+Shift+Z</kbd>
                                        ) : (
                                            <kbd className="flex ml-2 px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                                                <ArrowBigUp className='h-3 w-3 self-center' />
                                                <Command className='h-3 w-3 self-center ml-[1px]' />
                                                <span className='ml-0.5'>Z</span>
                                            </kbd>
                                        )}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>

            <aside className={`fixed top-5 group left-6 max-h-[calc(100vh-40px)] ml-2 ${OverlaysHiden === true ? 'z-0' : 'z-10'} w-16 rounded-lg bg-background border shadow-xl flex flex-col object-contain justify-start min-h-[140px]`}
                style={{ height: `${height}px`, maxHeight: 'calc(100vh - 40px)' }}
                ref={asideRef}
            >
                <div className="p-4 border-b flex items-center justify-center">
                    <HoverCard>
                        <HoverCardTrigger>
                            <Avatar size="md" className='cursor-pointer select-none'
                                onClick={() => window.open('https://github.com/HasanYahya101', '_blank')}
                            >
                                <AvatarImage src="https://github.com/HasanYahya101.png" draggable="false" />
                                <AvatarFallback className="bg-gray-100 border"
                                >HY</AvatarFallback>
                            </Avatar>
                        </HoverCardTrigger>
                        <HoverCardContent className="z-[100]"
                            side="bottom" align='start' sideOffset={3}
                        >
                            <div className="bg-white shadow-lg rounded-lg w-80 border border-gray-200">
                                <div className="flex items-center space-x-3 border-b p-2">
                                    <span className="text-xs ml-2 font-semibold text-gray-800">Last updated 7/19/2024
                                    </span>
                                </div>
                                <div className='p-4'>

                                    <div className="flex items-center space-x-4 mb-4">
                                        <Avatar className='cursor-pointer h-12 w-12 select-none'
                                            onClick={() => window.open('https://github.com/HasanYahya101', '_blank')}
                                        >
                                            <AvatarImage src="https://github.com/HasanYahya101.png" draggable="false" />
                                            <AvatarFallback className="bg-gray-100 border"
                                            >HY</AvatarFallback>
                                        </Avatar>

                                        <div>
                                            <h2 className="font-bold text-gray-800 hover:cursor-pointer hover:text-blue-800"
                                                onClick={() => window.open('https://github.com/HasanYahya101', '_blank')}
                                            >HasanYahya101</h2>
                                            <span className="text-gray-600 hover:cursor-pointer hover:text-blue-700"
                                                onClick={() => window.open('https://github.com/HasanYahya101', '_blank')}
                                            >Hasan Yahya</span>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 mb-4 text-base">
                                        Just a Person with a Computer. Trying to be a good Problem Solver.
                                    </p>

                                    <div className="flex items-center space-x-2 mb-2">
                                        <Star className="text-purple-600" size={14} />
                                        <span className="text-purple-600 font-semibold px-2 py-0.5 rounded-full border border-purple-600 text-xs">PRO</span>
                                    </div>

                                    <div className="flex items-center space-x-2 mb-2">
                                        <BookMarked className="text-gray-500" size={14} />
                                        <span className="text-gray-700 text-sm">Owns this repository</span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <GitCompare className="text-gray-500" size={14} />
                                        <span className="text-gray-700 text-sm">Committed to this repository in the past</span>
                                    </div>
                                </div>
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                </div >
                <div className='overflow-auto'
                    style={{ scrollbarWidth: 'none' }}
                >
                    <div className="my-1.5 px-4 flex flex-col items-center justify-center mt-2">
                        <PopoverArrow open={pencilPopoverOpen} onOpenChange={setPencilPopoverOpen}
                        >
                            <PopoverTriggerArrow>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Button size="icon" variant={selected === 'pencil' ? 'secondary' : 'ghost'}
                                                onClick={() => setSelected('pencil')}
                                            >
                                                {penciltype === 'pencil' ? <Pencil className="w-6 h-6" />
                                                    : penciltype === 'brush' ? <Brush className="w-6 h-6" />
                                                        : penciltype === 'pen' ? <Pen className="w-6 h-6" />
                                                            : null
                                                }
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <span className='text-gray-500'>
                                                {penciltype === 'pencil' ? 'Pencil' : penciltype === 'brush' ? 'Brush' : penciltype === 'pen' ? 'Pen' : null}
                                            </span>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </PopoverTriggerArrow>
                            <PopoverContentArrow className="shadow-xl" side="right"
                                align="center" sideOffset={6}
                            >
                                <div className="flex flex-col h-full shadow-xl">
                                    <div className="p-4 border-b">
                                        <h2 className="text-lg font-semibold">Select Pencil Type</h2>
                                    </div>
                                    <div className="flex-1 overflow-auto p-3 space-y-1 justify-center">
                                        <div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="p-1">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Button variant={penciltype === 'pencil' ? 'secondary' : 'ghost'} size="icon"
                                                                    onClick={() => { setPencilType('pencil'); setPencilPopoverOpen(false) }}
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
                                                <div className="p-1">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Button variant={penciltype === 'brush' ? 'secondary' : 'ghost'} size="icon"
                                                                    onClick={() => { setPencilType('brush'); setPencilPopoverOpen(false) }}
                                                                >
                                                                    <Brush className="w-6 h-6" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <span className='text-gray-500'>Brush</span>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                                <div className="p-1">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Button variant={penciltype === 'pen' ? 'secondary' : 'ghost'} size="icon"
                                                                    onClick={() => { setPencilType('pen'); setPencilPopoverOpen(false) }}
                                                                >
                                                                    <Pen className="w-6 h-6" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <span className='text-gray-500'>Pen</span>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContentArrow>
                        </PopoverArrow>
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
                                    <PopoverContentArrow className="shadow-xl" side="right"
                                        align="center" sideOffset={6}
                                    >
                                        <div className="flex flex-col h-full shadow-xl">
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
                                <PopoverArrow open={fontOpen} onOpenChange={setFontOpen}
                                >
                                    <PopoverTriggerArrow>
                                        <TooltipTrigger>
                                            {selected === 'text' ? (
                                                <Button variant="secondary" size="icon" onClick={() => setSelected('text')}
                                                >
                                                    <ALargeSmall className="w-6 h-6" />
                                                </Button>
                                            ) : (<Button variant="ghost" size="icon" onClick={() => setSelected('text')}
                                            >
                                                <ALargeSmall className="w-6 h-6" />
                                            </Button>)}
                                        </TooltipTrigger>
                                    </PopoverTriggerArrow>
                                    <TooltipContent>
                                        <span className='text-gray-500'>Font and thickness</span>
                                    </TooltipContent>
                                    <PopoverContentArrow className="shadow-xl" side="right"
                                        align="center" sideOffset={3}
                                    >
                                        <div className="flex flex-col h-full shadow-xl">
                                            <div className="p-2 border-b">
                                                <div className="flex items-center justify-between">
                                                    <h2 className="text-lg font-semibold pl-2">Select Font</h2>
                                                    {/* Toggle group for bold and italic */}
                                                    <div className="flex items-center space-x-1.5 p-1 border rounded-lg">
                                                        {/* Place this div at the end of the flex container */}
                                                        <div className="ml-auto flex items-center justify-center space-x-1.5">
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <Toggle
                                                                            aria-label="Toggle bold"
                                                                            onPressedChange={() => setBold(!bold)}
                                                                            pressed={bold}
                                                                            variant="ghost"
                                                                        >
                                                                            <Bold className="h-4 w-4" />
                                                                        </Toggle>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <span className='text-gray-500'>Bold</span>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <Toggle
                                                                            aria-label="Toggle italic"
                                                                            onPressedChange={() => setItalic(!italic)}
                                                                            pressed={italic}
                                                                            variant="ghost"
                                                                        >
                                                                            <Italic className="h-4 w-4" />
                                                                        </Toggle>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <span className='text-gray-500'>Italic</span>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-1 overflow-auto space-y-1 justify-center">
                                                <div className='p-3'>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        <div className="p-1">
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <Button variant={font === 'sera' ? 'secondary' : 'ghost'} size="icon"
                                                                            onClick={() => setFont('sera')}
                                                                        >
                                                                            <span className={`font-sera ${bold ? 'font-bold' : ''} ${italic ? 'italic' : ''}`}>Aa</span>
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <span className='text-gray-500'>Sera</span>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                        <div className="p-1">
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <Button variant={font === 'block' ? 'secondary' : 'ghost'} size="icon"
                                                                            onClick={() => setFont('block')}
                                                                        >
                                                                            <span className={`font-block ${bold ? 'font-bold' : ''} ${italic ? 'italic' : ''}`}>Aa</span>
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <span className='text-gray-500'>Block</span>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                        <div className="p-1">
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <Button variant={font === 'oswald' ? 'secondary' : 'ghost'} size="icon"
                                                                            onClick={() => setFont('oswald')}
                                                                        >
                                                                            <span className={`font-oswald ${bold ? 'font-bold' : ''} ${italic ? 'italic' : ''}`}>Aa</span>
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <span className='text-gray-500'>Oswald</span>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                        {/*custom fonts*/}
                                                        <div className="p-1">
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <Button variant={font === 'cursive' ? 'secondary' : 'ghost'} size="icon"
                                                                            onClick={() => setFont('cursive')}
                                                                        >
                                                                            <span className={`font-cursive ${bold ? 'font-bold' : ''} ${italic ? 'italic' : ''}`}
                                                                            >Aa</span>
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <span className='text-gray-500'>Cursive</span>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                        <div className="p-1">
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <Button variant={font === 'roboto' ? 'secondary' : 'ghost'} size="icon"
                                                                            onClick={() => setFont('roboto')}
                                                                        >
                                                                            <span className={`font-roboto ${bold ? 'font-bold' : ''} ${italic ? 'italic' : ''}`}>Aa</span>
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <span className='text-gray-500'>Roboto</span>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                        <div className="p-1">
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <Button variant={font === 'playwrite' ? 'secondary' : 'ghost'} size="icon"
                                                                            onClick={() => setFont('playwrite')}
                                                                        >
                                                                            <span className={`font-playwrite ${bold ? 'font-bold' : ''} ${italic ? 'italic' : ''}`}>Aa</span>
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <span className='text-gray-500'>Playwrite</span>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                        <div className="p-1">
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <Button variant={font === 'arsenal' ? 'secondary' : 'ghost'} size="icon"
                                                                            onClick={() => setFont('arsenal')}
                                                                        >
                                                                            <span className={`font-arsenal ${bold ? 'font-bold' : ''} ${italic ? 'italic' : ''}`}>Aa</span>
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <span className='text-gray-500'>Arsenal</span>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                        <div className="p-1">
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <Button variant={font === 'anton' ? 'secondary' : 'ghost'} size="icon"
                                                                            onClick={() => setFont('anton')}
                                                                        >
                                                                            <span className={`font-anton ${bold ? 'font-bold' : ''} ${italic ? 'italic' : ''}`}>Aa</span>
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <span className='text-gray-500'>Anton</span>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='space-y-6 flex-1'></div>
                                            </div>
                                            {/*Slider for custom font size with preview*/}
                                            <div className='mx-3'>
                                                <div>
                                                    <div className="flex justify-between items-center mb-3 mx-1">
                                                        <span className="text-sm font-medium">Custom Size</span>
                                                        <span className="text-sm text-muted-foreground">{fontSize}px</span>
                                                    </div>
                                                    <Slider
                                                        min={8}
                                                        max={40}
                                                        step={1}
                                                        value={[fontSize]}
                                                        onValueChange={(value) => setFontSize(value)}
                                                        className="hover:cursor-move"
                                                    />
                                                </div>
                                                <div className="border-t" />
                                                <div className="flex justify-center items-center space-x-3 p-3">
                                                    <span className="text-sm font-medium">Preview:</span>
                                                    <span
                                                        className={`text-black items-center justify-center font-${font} flex ${bold ? 'font-bold' : ''} ${italic ? 'italic' : ''}`}
                                                        style={{
                                                            fontSize: `${fontSize}px`,
                                                        }}
                                                    >
                                                        Aa
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </PopoverContentArrow>
                                </PopoverArrow>
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
                                                <div className="bg-muted border rounded-full group-hover:bg-white" style={{ width: `${thickness}px`, height: `${thickness}px` }} />
                                            </Button>
                                        </TooltipTrigger>
                                    </PopoverTriggerArrow>
                                    <PopoverContentArrow className="shadow-xl" side="right"
                                        align="center" sideOffset={3}
                                    >
                                        <div className="flex flex-col h-full shadow-xl">
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
                <div className="p-4 border-t flex justify-center z-50">
                    <TooltipProvider>
                        <Tooltip>
                            <Popover open={downloadOpen} onOpenChange={setDownloadOpen}
                            >
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
                                        <div className="items-center text-center justify-center p-2 border rounded-t cursor-pointer hover:bg-gray-100 z-10"
                                            onClick={() => { exportImagePNG('png'); setDownloadOpen(false); }}
                                        >
                                            Download PNG
                                        </div>
                                        <div className="items-center text-center justify-center p-2 border-t border-l border-r rounded-b cursor-pointer hover:bg-gray-100 z-10"
                                            onMouseEnter={() => setIsHoveredJPEG(true)}
                                            onMouseLeave={() => setIsHoveredJPEG(false)}
                                            onClick={() => { exportImageJPEG('jpeg'); setDownloadOpen(false); }}
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
                    <div
                        className="absolute bottom-0 right-0 w-4 h-4 cursor-ns-resize bg-white bg-opacity-0 rounded-lg"
                        onMouseDown={handleMouseDownResize}
                    >
                        <div className="w-full h-full rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <svg className="h-full w-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 15L15 21M21 8L8 21" stroke="#9ca3af" // gray-400
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </aside >

            <div
                className={`h-screen max-h-screen max-w-[100vw] bg-white self-center relative w-screen border-black overflow-hidden ${selected === "text" ? 'cursor-crosshair' : 'cursor-crosshair'}`}
                onSingleTap={draw}
            >
                <ContextMenu>
                    <ContextMenuTrigger>
                        <canvas
                            className={`w-[100vw] h-screen bg-white ${selected === "text" ? 'cursor-crosshair' : 'cursor-crosshair'}`}
                            ref={canvasRef}
                            onMouseDown={handleMouseDown}
                            onMouseUp={stopDrawing}
                            onMouseOut={stopDrawing}
                            onMouseMove={draw}
                            onClick={draw}
                            onDoubleClickCapture={draw}
                            onMouseDownCapture={draw}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            // remove anti-aliasing using styles
                            /*style={{
                                imageRendering: 'pixelated',
                                imageRendering: 'crisp-edges',
                                imageRendering: '-moz-crisp-edges',
                                imageRendering: '-webkit-optimize-contrast',
                                imageRendering: 'optimize-contrast',
                                imageRendering: 'optimizeSpeed',
                                imageRendering: 'optimizeQuality',
                                transform: 'scale(1)',
                                transformOrigin: '0 0',
                            }}*/
                            style={{
                                imageRendering: 'crisp-edges',
                                transform: 'scale(1)',
                                transformOrigin: '0 0'
                            }}
                        />
                    </ContextMenuTrigger>
                    <ContextMenuContent className='w-64'>
                        <ContextMenuItem inset
                            onClick={() => { undo(); }}
                            disabled={undoDisabled}
                        >
                            Undo
                            <ContextMenuShortcut>{undo_shortcut}</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuItem inset
                            onClick={() => { redo(); }}
                            disabled={redoDisabled}
                        >
                            Redo
                            <ContextMenuShortcut>{redo_shortcut}</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem inset
                            onClick={() => { setAlertOpen(true); }}
                        >
                            Add Text
                            <ContextMenuShortcut>{add_text_shortcut}</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuItem inset
                            onClick={() => { clearCanvas(); }}
                        >
                            Clear Canvas
                            <ContextMenuShortcut>{clear_shortcut}</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuItem inset
                            onClick={() => { setOverlaysHiden(!OverlaysHiden); }}
                        >
                            {OverlaysHiden ? 'Show Overlays' : 'Hide Overlays'}
                            <ContextMenuShortcut>{overlays_shortcut}</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuSub>
                            <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
                            <ContextMenuSubContent className="w-48">
                                <ContextMenuItem
                                    onClick={() => { setSelected('pencil'); }}
                                >
                                    Select Pencil
                                    <ContextMenuShortcut>{pencil_shortcut}</ContextMenuShortcut>
                                </ContextMenuItem>
                                <ContextMenuItem
                                    onClick={() => { setSelected('eraser'); }}
                                >
                                    Select Eraser
                                    <ContextMenuShortcut>{eraser_shortcut}</ContextMenuShortcut>
                                </ContextMenuItem>
                                <ContextMenuSeparator />
                                <ContextMenuItem
                                    onClick={() => { setSelected('shapes'); }}
                                >
                                    Select Shapes
                                    <ContextMenuShortcut>{shapes_shortcut}</ContextMenuShortcut>
                                </ContextMenuItem>
                                <ContextMenuItem
                                    onClick={() => { setSelected('color picker'); }}
                                >
                                    Select Color Picker
                                    <ContextMenuShortcut>{color_picker_shortcut}</ContextMenuShortcut>
                                </ContextMenuItem>
                                <ContextMenuItem
                                    onClick={() => { setSelected('fill'); }}
                                >
                                    Select Fill
                                    <ContextMenuShortcut>{fill_shortcut}</ContextMenuShortcut>
                                </ContextMenuItem>
                            </ContextMenuSubContent>
                        </ContextMenuSub>
                    </ContextMenuContent>
                </ContextMenu>
            </div>
            <div className="fixed bottom-24 right-9 flex flex-col gap-2">
                <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}
                >
                    <AlertDialogTrigger>
                        <button className={`bg-purple-500 hover:bg-purple-600 text-white rounded-full p-3 shadow-lg transition-all duration-300 flex items-center group hover:pr-6 ${OverlaysHiden === true ? 'hidden' : ''}`}
                            onMouseEnter={() => setTextHover(true)}
                            onMouseLeave={() => setTextHover(false)}
                        //onClick={() => setSelected('text')}
                        >
                            <Type size={24} />
                            {textHover === true ?
                                <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ml-1">
                                    Text
                                </span>
                                : null}
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-md">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-semibold">Enter Your Text</AlertDialogTitle>
                            <AlertDialogDescription className="text-sm text-gray-500">
                                Please enter the text you want to display on the canvas. Upon double clicking on the canvas, the text will be displayed.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="my-4">
                            <Input
                                type="text"
                                placeholder="Type here..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel asChild>
                                <Button variant="outline" className="w-full sm:w-auto"
                                    onClick={() => setAlertOpen(false)}
                                >Cancel</Button>
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <Button onClick={() => { handleConfirm(); }}
                                    disabled={inputValue === ''}
                                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white">Confirm</Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
            <div className={`fixed bottom-9 right-9 flex flex-col gap-2 ${OverlaysHiden === true ? 'hidden' : ''}`}>
                <button className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg transition-all duration-300 flex items-center group hover:pr-6"
                    onMouseEnter={() => setNewHover(true)}
                    onMouseLeave={() => setNewHover(false)}
                    onClick={() => clearCanvas()}
                >
                    <Plus size={24} />
                    {newHover === true ?
                        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ml-1">
                            New
                        </span>
                        : null}
                </button>
            </div>
            <Toaster theme="light" position="top-center"
            //className="ml-[calc(50vw-13rem)]"
            />
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
