"use client";

import type React from "react";

import { useEffect, useRef, useState, useCallback } from "react";
import CanvasToolbar from "./CanvasToolbar";
import type { CanvasHistory, CanvasTool } from "@/types/canvas";
import { useHotkeys } from "react-hotkeys-hook";

interface CanvasDrawingProps {
  onImageGenerated: (file: File, url: string) => void;
}

// Tool states interfaces
interface LineToolState {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isDrawing: boolean;
  shiftKey: boolean;
}

interface ShapeToolState {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isDrawing: boolean;
  isFilled: boolean;
  shiftKey: boolean;
}

interface TextToolState {
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  isPlacing: boolean;
}

interface PolygonToolState {
  points: Array<{ x: number; y: number }>;
  isDrawing: boolean;
  tempEndX: number;
  tempEndY: number;
}

interface SelectionToolState {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isSelecting: boolean;
  selectedImageData: ImageData | null;
  isDragging: boolean;
  dragStartX: number;
  dragStartY: number;
}

export default function CanvasDrawing({
  onImageGenerated,
}: CanvasDrawingProps) {
  // Main canvas refs and state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [tempCtx, setTempCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [currentBackground, setCurrentBackground] = useState("canvas");

  // Tool states
  const [currentTool, setCurrentTool] = useState<CanvasTool>("brush");
  const [currentColor, setCurrentColor] = useState("#00f5ff");
  const [brushSize, setBrushSize] = useState(10);
  const [isFilled, setIsFilled] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  // History management
  const [history, setHistory] = useState<CanvasHistory[]>([]);
  const [redoStack, setRedoStack] = useState<CanvasHistory[]>([]);

  // Tool-specific states
  const [lineToolState, setLineToolState] = useState<LineToolState>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    isDrawing: false,
    shiftKey: false,
  });

  const [shapeToolState, setShapeToolState] = useState<ShapeToolState>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    isDrawing: false,
    isFilled: false,
    shiftKey: false,
  });

  const [textToolState, setTextToolState] = useState<TextToolState>({
    x: 0,
    y: 0,
    text: "",
    fontSize: 20,
    fontFamily: "Arial",
    isPlacing: false,
  });

  const [polygonToolState, setPolygonToolState] = useState<PolygonToolState>({
    points: [],
    isDrawing: false,
    tempEndX: 0,
    tempEndY: 0,
  });

  const [selectionToolState, setSelectionToolState] =
    useState<SelectionToolState>({
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      isSelecting: false,
      selectedImageData: null,
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
    });

  const [textInput, setTextInput] = useState<string>("");
  const [showTextInput, setShowTextInput] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(20);
  const [fontFamily, setFontFamily] = useState<string>("Arial");

  // Initialize main canvas and temp canvas for previews
  useEffect(() => {
    const canvas = canvasRef.current;
    const tempCanvas = tempCanvasRef.current;

    if (!canvas || !tempCanvas) return;

    // Set canvas size based on container
    const container = canvas.parentElement;
    if (container) {
      const { width, height } = container.getBoundingClientRect();
      const newWidth = Math.min(width - 20, 1400);
      const newHeight = Math.min(height - 80, 900);

      setCanvasSize({
        width: newWidth,
        height: newHeight,
      });

      canvas.width = newWidth;
      canvas.height = newHeight;
      tempCanvas.width = newWidth;
      tempCanvas.height = newHeight;
    }

    const context = canvas.getContext("2d", { willReadFrequently: true });
    const tempContext = tempCanvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (context && tempContext) {
      // Set up context properties
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = currentColor;
      context.lineWidth = brushSize;

      tempContext.lineCap = "round";
      tempContext.lineJoin = "round";
      tempContext.strokeStyle = currentColor;
      tempContext.lineWidth = brushSize;

      setCtx(context);
      setTempCtx(tempContext);

      // Save initial canvas state
      const initialState = canvas.toDataURL("image/png");
      setHistory([{ imageData: initialState }]);
    }
  }, []);

  // Update canvas size on window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const tempCanvas = tempCanvasRef.current;

      if (!canvas || !tempCanvas) return;

      const container = canvas.parentElement;
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        const newWidth = Math.min(width - 20, 1400);
        const newHeight = Math.min(height - 80, 900);

        setCanvasSize({
          width: newWidth,
          height: newHeight,
        });

        // Preserve current drawing when resizing
        const currentDrawing = canvas.toDataURL();

        canvas.width = newWidth;
        canvas.height = newHeight;
        tempCanvas.width = newWidth;
        tempCanvas.height = newHeight;

        // Restore the drawing after resize
        if (ctx) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = currentDrawing;
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
          };
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ctx]);

  // Update context when tool, color or size changes
  useEffect(() => {
    if (!ctx || !tempCtx) return;

    ctx.strokeStyle = currentColor;
    ctx.fillStyle = currentColor;
    ctx.lineWidth = brushSize;

    tempCtx.strokeStyle = currentColor;
    tempCtx.fillStyle = currentColor;
    tempCtx.lineWidth = brushSize;
  }, [ctx, tempCtx, currentColor, brushSize]);

  // Keyboard shortcuts
  useHotkeys("ctrl+z", handleUndo, { enableOnFormTags: true });
  useHotkeys("ctrl+y", handleRedo, { enableOnFormTags: true });
  useHotkeys(
    "ctrl+s",
    (e) => {
      e.preventDefault();
      handleSave();
    },
    { enableOnFormTags: true }
  );

  // Tool shortcuts
  useHotkeys("b", () => setCurrentTool("brush"), { enableOnFormTags: false });
  useHotkeys("e", () => setCurrentTool("eraser"), { enableOnFormTags: false });
  useHotkeys("l", () => setCurrentTool("line"), { enableOnFormTags: false });
  useHotkeys("r", () => setCurrentTool("rectangle"), {
    enableOnFormTags: false,
  });
  useHotkeys("c", () => setCurrentTool("circle"), { enableOnFormTags: false });
  useHotkeys("p", () => setCurrentTool("polygon"), { enableOnFormTags: false });
  useHotkeys("t", () => setCurrentTool("text"), { enableOnFormTags: false });
  useHotkeys("f", () => setCurrentTool("fill"), { enableOnFormTags: false });
  useHotkeys("i", () => setCurrentTool("eyedropper"), {
    enableOnFormTags: false,
  });
  useHotkeys("s", () => setCurrentTool("selection"), {
    enableOnFormTags: false,
  });

  // Save canvas state for undo/redo
  const saveCanvasState = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL("image/png");

    setHistory((prev) => {
      // Limit history to 20 steps
      const newHistory = [...prev, { imageData }];
      if (newHistory.length > 20) {
        return newHistory.slice(newHistory.length - 20);
      }
      return newHistory;
    });

    // Clear redo stack when new action is performed
    setRedoStack([]);
  }, []);

  // Get mouse/touch position relative to canvas
  const getPointerPosition = useCallback(
    (
      e:
        | React.MouseEvent<HTMLCanvasElement>
        | React.TouchEvent<HTMLCanvasElement>
        | MouseEvent
        | TouchEvent
    ) => {
      if (!canvasRef.current) return { x: 0, y: 0 };

      const rect = canvasRef.current.getBoundingClientRect();
      let x, y;

      if ("touches" in e) {
        // Touch event
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      } else {
        // Mouse event - all mouse event types have clientX/clientY
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }

      return { x, y };
    },
    []
  );

  // Clear the temporary canvas
  const clearTempCanvas = useCallback(() => {
    if (!tempCtx || !tempCanvasRef.current) return;
    tempCtx.clearRect(
      0,
      0,
      tempCanvasRef.current.width,
      tempCanvasRef.current.height
    );
  }, [tempCtx]);

  // Apply the temporary canvas to the main canvas
  const applyTempCanvas = useCallback(() => {
    if (!ctx || !tempCtx || !canvasRef.current || !tempCanvasRef.current)
      return;

    ctx.drawImage(tempCanvasRef.current, 0, 0);
    clearTempCanvas();
  }, [ctx, tempCtx, clearTempCanvas]);

  // Calculate constrained line for shift key
  const calculateConstrainedLine = useCallback(
    (startX: number, startY: number, endX: number, endY: number) => {
      const dx = endX - startX;
      const dy = endY - startY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // If horizontal movement is greater, constrain to horizontal
      if (absDx > absDy) {
        return { x: endX, y: startY };
      } else {
        // Otherwise constrain to vertical
        return { x: startX, y: endY };
      }
    },
    []
  );

  // Calculate constrained rectangle for shift key (perfect square)
  const calculateConstrainedRect = useCallback(
    (startX: number, startY: number, endX: number, endY: number) => {
      const dx = endX - startX;
      const dy = endY - startY;
      const size = Math.max(Math.abs(dx), Math.abs(dy));

      const newEndX = startX + (dx >= 0 ? size : -size);
      const newEndY = startY + (dy >= 0 ? size : -size);

      return { x: newEndX, y: newEndY };
    },
    []
  );

  // Start drawing
  const startDrawing = useCallback(
    (
      e:
        | React.MouseEvent<HTMLCanvasElement>
        | React.TouchEvent<HTMLCanvasElement>
    ) => {
      if (!ctx || !tempCtx || !canvasRef.current) return;

      const { x, y } = getPointerPosition(e);
      const isShiftPressed = "shiftKey" in e && e.shiftKey;

      // Handle different tools
      switch (currentTool) {
        case "brush":
          setIsDrawing(true);
          ctx.beginPath();
          ctx.moveTo(x, y);
          break;

        case "eraser":
          setIsDrawing(true);
          ctx.beginPath();
          ctx.moveTo(x, y);
          break;

        case "line":
          setLineToolState({
            startX: x,
            startY: y,
            endX: x,
            endY: y,
            isDrawing: true,
            shiftKey: isShiftPressed,
          });
          break;

        case "rectangle":
        case "circle":
          setShapeToolState({
            startX: x,
            startY: y,
            endX: x,
            endY: y,
            isDrawing: true,
            isFilled,
            shiftKey: isShiftPressed,
          });
          break;

        case "polygon":
          if (!polygonToolState.isDrawing) {
            // Start a new polygon
            setPolygonToolState({
              points: [{ x, y }],
              isDrawing: true,
              tempEndX: x,
              tempEndY: y,
            });
          } else {
            // Add a point to the existing polygon
            setPolygonToolState((prev) => ({
              ...prev,
              points: [...prev.points, { x, y }],
              tempEndX: x,
              tempEndY: y,
            }));
          }
          break;

        case "text":
          setTextToolState({
            x,
            y,
            text: "",
            fontSize,
            fontFamily,
            isPlacing: true,
          });
          setShowTextInput(true);
          break;

        case "fill":
          floodFill(x, y, currentColor);
          break;

        case "eyedropper":
          pickColor(x, y);
          break;

        case "selection":
          // Start selection
          setSelectionToolState({
            startX: x,
            startY: y,
            endX: x,
            endY: y,
            isSelecting: true,
            selectedImageData: null,
            isDragging: false,
            dragStartX: 0,
            dragStartY: 0,
          });
          break;
      }
    },
    [
      ctx,
      tempCtx,
      currentTool,
      currentColor,
      isFilled,
      polygonToolState,
      fontSize,
      fontFamily,
      getPointerPosition,
    ]
  );

  // Draw
  const draw = useCallback(
    (
      e:
        | React.MouseEvent<HTMLCanvasElement>
        | React.TouchEvent<HTMLCanvasElement>
    ) => {
      if (!ctx || !tempCtx || !canvasRef.current || !tempCanvasRef.current)
        return;

      const { x, y } = getPointerPosition(e);
      const isShiftPressed = "shiftKey" in e && e.shiftKey;

      // Handle different tools
      switch (currentTool) {
        case "brush":
          if (isDrawing) {
            ctx.lineTo(x, y);
            ctx.stroke();
          }
          break;

        case "eraser":
          if (isDrawing) {
            ctx.save();
            ctx.globalCompositeOperation = "destination-out";
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.restore();
          }
          break;

        case "line":
          if (lineToolState.isDrawing) {
            // Clear the temp canvas
            clearTempCanvas();

            // Calculate end point (constrained if shift is pressed)
            let endX = x;
            let endY = y;

            if (isShiftPressed || lineToolState.shiftKey) {
              const constrained = calculateConstrainedLine(
                lineToolState.startX,
                lineToolState.startY,
                x,
                y
              );
              endX = constrained.x;
              endY = constrained.y;
            }

            // Draw the line preview
            tempCtx.beginPath();
            tempCtx.moveTo(lineToolState.startX, lineToolState.startY);
            tempCtx.lineTo(endX, endY);
            tempCtx.stroke();

            // Update line state
            setLineToolState((prev) => ({
              ...prev,
              endX,
              endY,
              shiftKey: isShiftPressed,
            }));
          }
          break;

        case "rectangle":
          if (shapeToolState.isDrawing) {
            // Clear the temp canvas
            clearTempCanvas();

            // Calculate end point (constrained if shift is pressed)
            let endX = x;
            let endY = y;

            if (isShiftPressed || shapeToolState.shiftKey) {
              const constrained = calculateConstrainedRect(
                shapeToolState.startX,
                shapeToolState.startY,
                x,
                y
              );
              endX = constrained.x;
              endY = constrained.y;
            }

            // Calculate rectangle dimensions
            const width = endX - shapeToolState.startX;
            const height = endY - shapeToolState.startY;

            // Draw the rectangle preview
            tempCtx.beginPath();
            tempCtx.rect(
              shapeToolState.startX,
              shapeToolState.startY,
              width,
              height
            );

            if (shapeToolState.isFilled) {
              tempCtx.fill();
            } else {
              tempCtx.stroke();
            }

            // Update shape state
            setShapeToolState((prev) => ({
              ...prev,
              endX,
              endY,
              shiftKey: isShiftPressed,
            }));
          }
          break;

        case "circle":
          if (shapeToolState.isDrawing) {
            // Clear the temp canvas
            clearTempCanvas();

            // Calculate end point (constrained if shift is pressed)
            let endX = x;
            let endY = y;

            if (isShiftPressed || shapeToolState.shiftKey) {
              const constrained = calculateConstrainedRect(
                shapeToolState.startX,
                shapeToolState.startY,
                x,
                y
              );
              endX = constrained.x;
              endY = constrained.y;
            }

            // Calculate radius
            const radiusX = Math.abs(endX - shapeToolState.startX) / 2;
            const radiusY = Math.abs(endY - shapeToolState.startY) / 2;
            const centerX =
              shapeToolState.startX + (endX - shapeToolState.startX) / 2;
            const centerY =
              shapeToolState.startY + (endY - shapeToolState.startY) / 2;

            // Draw the circle preview
            tempCtx.beginPath();
            tempCtx.ellipse(
              centerX,
              centerY,
              radiusX,
              radiusY,
              0,
              0,
              Math.PI * 2
            );

            if (shapeToolState.isFilled) {
              tempCtx.fill();
            } else {
              tempCtx.stroke();
            }

            // Update shape state
            setShapeToolState((prev) => ({
              ...prev,
              endX,
              endY,
              shiftKey: isShiftPressed,
            }));
          }
          break;

        case "polygon":
          if (
            polygonToolState.isDrawing &&
            polygonToolState.points.length > 0
          ) {
            // Clear the temp canvas
            clearTempCanvas();

            // Draw the polygon preview
            tempCtx.beginPath();
            tempCtx.moveTo(
              polygonToolState.points[0].x,
              polygonToolState.points[0].y
            );

            // Draw lines between all points
            for (let i = 1; i < polygonToolState.points.length; i++) {
              tempCtx.lineTo(
                polygonToolState.points[i].x,
                polygonToolState.points[i].y
              );
            }

            // Draw line to current mouse position
            tempCtx.lineTo(x, y);
            tempCtx.stroke();

            // Update polygon state
            setPolygonToolState((prev) => ({
              ...prev,
              tempEndX: x,
              tempEndY: y,
            }));
          }
          break;

        case "selection":
          const selState = selectionToolState;

          if (selState.isSelecting) {
            // Clear the temp canvas
            clearTempCanvas();

            // Draw selection rectangle
            tempCtx.setLineDash([5, 5]);
            tempCtx.strokeStyle = "#ffffff";
            tempCtx.lineWidth = 1;
            tempCtx.strokeRect(
              selState.startX,
              selState.startY,
              x - selState.startX,
              y - selState.startY
            );
            tempCtx.setLineDash([]);
            tempCtx.strokeStyle = currentColor;
            tempCtx.lineWidth = brushSize;

            // Update selection state
            setSelectionToolState((prev) => ({
              ...prev,
              endX: x,
              endY: y,
            }));
          } else if (selState.isDragging && selState.selectedImageData) {
            // Clear the temp canvas
            clearTempCanvas();

            // Calculate the offset
            const offsetX = x - selState.dragStartX;
            const offsetY = y - selState.dragStartY;

            // Draw the selected image at the new position
            tempCtx.putImageData(
              selState.selectedImageData,
              selState.startX + offsetX,
              selState.startY + offsetY
            );
          }
          break;
      }
    },
    [
      ctx,
      tempCtx,
      isDrawing,
      currentTool,
      currentColor,
      brushSize,
      lineToolState,
      shapeToolState,
      polygonToolState,
      selectionToolState,
      getPointerPosition,
      clearTempCanvas,
      calculateConstrainedLine,
      calculateConstrainedRect,
    ]
  );

  // Stop drawing
  const stopDrawing = useCallback(
    (
      e:
        | React.MouseEvent<HTMLCanvasElement>
        | React.TouchEvent<HTMLCanvasElement>
    ) => {
      if (!ctx || !tempCtx || !canvasRef.current) return;

      const { x, y } = getPointerPosition(e);

      switch (currentTool) {
        case "brush":
        case "eraser":
          if (isDrawing) {
            setIsDrawing(false);
            ctx.closePath();
            saveCanvasState();
          }
          break;

        case "line":
          if (lineToolState.isDrawing) {
            // Calculate end point (constrained if shift key is pressed)
            let endX = lineToolState.endX;
            let endY = lineToolState.endY;

            if (lineToolState.shiftKey) {
              const constrained = calculateConstrainedLine(
                lineToolState.startX,
                lineToolState.startY,
                endX,
                endY
              );
              endX = constrained.x;
              endY = constrained.y;
            }

            // Draw the final line on the main canvas
            ctx.beginPath();
            ctx.moveTo(lineToolState.startX, lineToolState.startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            // Clear the temp canvas
            clearTempCanvas();

            // Reset line state
            setLineToolState({
              startX: 0,
              startY: 0,
              endX: 0,
              endY: 0,
              isDrawing: false,
              shiftKey: false,
            });

            saveCanvasState();
          }
          break;

        case "rectangle":
          if (shapeToolState.isDrawing) {
            // Calculate end point (constrained if shift key is pressed)
            let endX = shapeToolState.endX;
            let endY = shapeToolState.endY;

            if (shapeToolState.shiftKey) {
              const constrained = calculateConstrainedRect(
                shapeToolState.startX,
                shapeToolState.startY,
                endX,
                endY
              );
              endX = constrained.x;
              endY = constrained.y;
            }

            // Calculate rectangle dimensions
            const width = endX - shapeToolState.startX;
            const height = endY - shapeToolState.startY;

            // Draw the final rectangle on the main canvas
            ctx.beginPath();
            ctx.rect(
              shapeToolState.startX,
              shapeToolState.startY,
              width,
              height
            );

            if (shapeToolState.isFilled) {
              ctx.fill();
            } else {
              ctx.stroke();
            }

            // Clear the temp canvas
            clearTempCanvas();

            // Reset shape state
            setShapeToolState({
              startX: 0,
              startY: 0,
              endX: 0,
              endY: 0,
              isDrawing: false,
              isFilled: isFilled,
              shiftKey: false,
            });

            saveCanvasState();
          }
          break;

        case "circle":
          if (shapeToolState.isDrawing) {
            // Calculate end point (constrained if shift key is pressed)
            let endX = shapeToolState.endX;
            let endY = shapeToolState.endY;

            if (shapeToolState.shiftKey) {
              const constrained = calculateConstrainedRect(
                shapeToolState.startX,
                shapeToolState.startY,
                endX,
                endY
              );
              endX = constrained.x;
              endY = constrained.y;
            }

            // Calculate radius
            const radiusX = Math.abs(endX - shapeToolState.startX) / 2;
            const radiusY = Math.abs(endY - shapeToolState.startY) / 2;
            const centerX =
              shapeToolState.startX + (endX - shapeToolState.startX) / 2;
            const centerY =
              shapeToolState.startY + (endY - shapeToolState.startY) / 2;

            // Draw the final circle on the main canvas
            ctx.beginPath();
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);

            if (shapeToolState.isFilled) {
              ctx.fill();
            } else {
              ctx.stroke();
            }

            // Clear the temp canvas
            clearTempCanvas();

            // Reset shape state
            setShapeToolState({
              startX: 0,
              startY: 0,
              endX: 0,
              endY: 0,
              isDrawing: false,
              isFilled: isFilled,
              shiftKey: false,
            });

            saveCanvasState();
          }
          break;

        case "selection":
          const selState = selectionToolState;

          if (selState.isSelecting) {
            // Finalize selection
            const startX = Math.min(selState.startX, selState.endX);
            const startY = Math.min(selState.startY, selState.endY);
            const width = Math.abs(selState.endX - selState.startX);
            const height = Math.abs(selState.endY - selState.startY);

            // Get the image data for the selection
            if (width > 0 && height > 0) {
              const imageData = ctx.getImageData(startX, startY, width, height);

              setSelectionToolState((prev) => ({
                ...prev,
                isSelecting: false,
                selectedImageData: imageData,
                startX,
                startY,
                endX: startX + width,
                endY: startY + height,
                isDragging: true,
                dragStartX: x,
                dragStartY: y,
              }));

              // Clear the temp canvas
              clearTempCanvas();

              // Draw the selection on the temp canvas
              tempCtx.putImageData(imageData, startX, startY);

              // Draw selection border
              tempCtx.setLineDash([5, 5]);
              tempCtx.strokeStyle = "#ffffff";
              tempCtx.lineWidth = 1;
              tempCtx.strokeRect(startX, startY, width, height);
              tempCtx.setLineDash([]);
              tempCtx.strokeStyle = currentColor;
              tempCtx.lineWidth = brushSize;
            } else {
              // Reset selection if too small
              setSelectionToolState({
                startX: 0,
                startY: 0,
                endX: 0,
                endY: 0,
                isSelecting: false,
                selectedImageData: null,
                isDragging: false,
                dragStartX: 0,
                dragStartY: 0,
              });

              clearTempCanvas();
            }
          } else if (selState.isDragging && selState.selectedImageData) {
            // Apply the dragged selection
            const offsetX = x - selState.dragStartX;
            const offsetY = y - selState.dragStartY;

            // Clear the original selection area
            ctx.clearRect(
              selState.startX,
              selState.startY,
              selState.endX - selState.startX,
              selState.endY - selState.startY
            );

            // Draw the selection at the new position
            ctx.putImageData(
              selState.selectedImageData,
              selState.startX + offsetX,
              selState.startY + offsetY
            );

            // Clear the temp canvas
            clearTempCanvas();

            // Reset selection state
            setSelectionToolState({
              startX: 0,
              startY: 0,
              endX: 0,
              endY: 0,
              isSelecting: false,
              selectedImageData: null,
              isDragging: false,
              dragStartX: 0,
              dragStartY: 0,
            });

            saveCanvasState();
          }
          break;
      }
    },
    [
      ctx,
      tempCtx,
      isDrawing,
      currentTool,
      currentColor,
      brushSize,
      isFilled,
      lineToolState,
      shapeToolState,
      selectionToolState,
      getPointerPosition,
      clearTempCanvas,
      calculateConstrainedLine,
      calculateConstrainedRect,
      saveCanvasState,
    ]
  );

  // Function to handle double click for completing polygons
  const handleDoubleClick = useCallback(() => {
    if (
      !ctx ||
      !canvasRef.current ||
      currentTool !== "polygon" ||
      !polygonToolState.isDrawing
    )
      return;

    if (polygonToolState.points.length >= 3) {
      // Draw the final polygon on the main canvas
      ctx.beginPath();
      ctx.moveTo(polygonToolState.points[0].x, polygonToolState.points[0].y);

      // Draw lines between all points
      for (let i = 1; i < polygonToolState.points.length; i++) {
        ctx.lineTo(polygonToolState.points[i].x, polygonToolState.points[i].y);
      }

      // Close the polygon
      ctx.closePath();

      if (isFilled) {
        ctx.fill();
      } else {
        ctx.stroke();
      }

      // Clear the temp canvas
      clearTempCanvas();

      // Reset polygon state
      setPolygonToolState({
        points: [],
        isDrawing: false,
        tempEndX: 0,
        tempEndY: 0,
      });

      saveCanvasState();
    }
  }, [
    ctx,
    currentTool,
    polygonToolState,
    isFilled,
    clearTempCanvas,
    saveCanvasState,
  ]);

  // Function to handle text input submission
  const handleTextSubmit = useCallback(() => {
    if (!ctx || !canvasRef.current || !textToolState.isPlacing || !textInput)
      return;

    // Set font properties
    ctx.font = `${textToolState.fontSize}px ${textToolState.fontFamily}`;
    ctx.fillStyle = currentColor;
    ctx.textBaseline = "top";

    // Draw the text
    ctx.fillText(textInput, textToolState.x, textToolState.y);

    // Reset text state
    setTextToolState({
      x: 0,
      y: 0,
      text: "",
      fontSize: fontSize,
      fontFamily: fontFamily,
      isPlacing: false,
    });
    setTextInput("");
    setShowTextInput(false);

    saveCanvasState();
  }, [
    ctx,
    textToolState,
    textInput,
    currentColor,
    fontSize,
    fontFamily,
    saveCanvasState,
  ]);

  // Function to pick a color from the canvas (eyedropper tool)
  const pickColor = useCallback(
    (x: number, y: number) => {
      if (!ctx || !canvasRef.current) return;

      try {
        const pixel = ctx.getImageData(x, y, 1, 1).data;

        // Skip transparent pixels
        if (pixel[3] === 0) return;

        // Convert RGB to hex
        const color = `#${pixel[0].toString(16).padStart(2, "0")}${pixel[1]
          .toString(16)
          .padStart(2, "0")}${pixel[2].toString(16).padStart(2, "0")}`;

        setCurrentColor(color);
        setCurrentTool("brush"); // Switch back to brush after picking a color
      } catch (error) {
        console.error("Error picking color:", error);
      }
    },
    [ctx, setCurrentColor, setCurrentTool]
  );

  // Function to fill an area with color (flood fill algorithm)
  const floodFill = useCallback(
    (startX: number, startY: number, fillColor: string) => {
      if (!ctx || !canvasRef.current) return;

      try {
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // Get the color at the start position
        const startPos = (Math.floor(startY) * width + Math.floor(startX)) * 4;
        const startR = data[startPos];
        const startG = data[startPos + 1];
        const startB = data[startPos + 2];
        const startA = data[startPos + 3];

        // Convert fill color from hex to RGBA
        const fillR = Number.parseInt(fillColor.slice(1, 3), 16);
        const fillG = Number.parseInt(fillColor.slice(3, 5), 16);
        const fillB = Number.parseInt(fillColor.slice(5, 7), 16);
        const fillA = 255;

        // Don't fill if the color is the same
        if (
          startR === fillR &&
          startG === fillG &&
          startB === fillB &&
          startA === fillA
        ) {
          return;
        }

        // Color matching threshold
        const threshold = 10;

        // Queue-based flood fill for better performance
        const pixelsToCheck = [
          { x: Math.floor(startX), y: Math.floor(startY) },
        ];
        const visited = new Set();

        while (pixelsToCheck.length > 0) {
          const { x, y } = pixelsToCheck.pop()!;
          const pos = (y * width + x) * 4;

          // Skip if already visited
          const key = `${x},${y}`;
          if (visited.has(key)) continue;
          visited.add(key);

          // Check if this pixel is within bounds and matches the start color
          if (
            x >= 0 &&
            x < width &&
            y >= 0 &&
            y < height &&
            Math.abs(data[pos] - startR) <= threshold &&
            Math.abs(data[pos + 1] - startG) <= threshold &&
            Math.abs(data[pos + 2] - startB) <= threshold &&
            Math.abs(data[pos + 3] - startA) <= threshold
          ) {
            // Set the color
            data[pos] = fillR;
            data[pos + 1] = fillG;
            data[pos + 2] = fillB;
            data[pos + 3] = fillA;

            // Add adjacent pixels to check
            pixelsToCheck.push({ x: x + 1, y });
            pixelsToCheck.push({ x: x - 1, y });
            pixelsToCheck.push({ x, y: y + 1 });
            pixelsToCheck.push({ x, y: y - 1 });
          }
        }

        // Put the modified image data back
        ctx.putImageData(imageData, 0, 0);
        saveCanvasState();
      } catch (error) {
        console.error("Error in flood fill:", error);
      }
    },
    [ctx, saveCanvasState]
  );

  // Add event listeners for double click to the canvas element
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleCanvasDoubleClick = (e: MouseEvent) => {
      e.preventDefault();
      handleDoubleClick();
    };

    canvas.addEventListener("dblclick", handleCanvasDoubleClick);

    return () => {
      canvas.removeEventListener("dblclick", handleCanvasDoubleClick);
    };
  }, [handleDoubleClick]);

  // Handle key events for shift key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        if (currentTool === "line" && lineToolState.isDrawing) {
          setLineToolState((prev) => ({ ...prev, shiftKey: true }));
        } else if (
          (currentTool === "rectangle" || currentTool === "circle") &&
          shapeToolState.isDrawing
        ) {
          setShapeToolState((prev) => ({ ...prev, shiftKey: true }));
        }
      } else if (e.key === "Escape") {
        // Cancel current operation
        if (currentTool === "polygon" && polygonToolState.isDrawing) {
          setPolygonToolState({
            points: [],
            isDrawing: false,
            tempEndX: 0,
            tempEndY: 0,
          });
          clearTempCanvas();
        } else if (currentTool === "text" && textToolState.isPlacing) {
          setTextToolState({
            x: 0,
            y: 0,
            text: "",
            fontSize: fontSize,
            fontFamily: fontFamily,
            isPlacing: false,
          });
          setShowTextInput(false);
        } else if (
          currentTool === "selection" &&
          selectionToolState.selectedImageData
        ) {
          setSelectionToolState({
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
            isSelecting: false,
            selectedImageData: null,
            isDragging: false,
            dragStartX: 0,
            dragStartY: 0,
          });
          clearTempCanvas();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        if (currentTool === "line" && lineToolState.isDrawing) {
          setLineToolState((prev) => ({ ...prev, shiftKey: false }));
        } else if (
          (currentTool === "rectangle" || currentTool === "circle") &&
          shapeToolState.isDrawing
        ) {
          setShapeToolState((prev) => ({ ...prev, shiftKey: false }));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    currentTool,
    lineToolState.isDrawing,
    shapeToolState.isDrawing,
    polygonToolState.isDrawing,
    textToolState.isPlacing,
    selectionToolState.selectedImageData,
    fontSize,
    fontFamily,
    clearTempCanvas,
  ]);

  // Handle undo
  function handleUndo() {
    if (history.length <= 1) return;

    const newHistory = [...history];
    const lastState = newHistory.pop();

    if (lastState) {
      setRedoStack((prev) => [...prev, lastState]);
    }

    setHistory(newHistory);

    if (newHistory.length > 0 && canvasRef.current && ctx) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = newHistory[newHistory.length - 1].imageData;
      img.onload = () => {
        ctx.clearRect(
          0,
          0,
          canvasRef.current!.width,
          canvasRef.current!.height
        );
        ctx.drawImage(img, 0, 0);
      };
    }
  }

  // Handle redo
  function handleRedo() {
    if (redoStack.length === 0) return;

    const newRedoStack = [...redoStack];
    const nextState = newRedoStack.pop();

    if (nextState) {
      setHistory((prev) => [...prev, nextState]);
      setRedoStack(newRedoStack);

      if (canvasRef.current && ctx) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = nextState.imageData;
        img.onload = () => {
          ctx.clearRect(
            0,
            0,
            canvasRef.current!.width,
            canvasRef.current!.height
          );
          ctx.drawImage(img, 0, 0);
        };
      }
    }
  }

  // Clear canvas
  const clearCanvas = useCallback(() => {
    if (!ctx || !canvasRef.current) return;

    // Save current state before clearing
    saveCanvasState();

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setShowConfirmClear(false);

    // Save cleared state
    saveCanvasState();
  }, [ctx, saveCanvasState]);

  // Save canvas as image
  const handleSave = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    // Create a high-resolution version for NFT
    const highResCanvas = document.createElement("canvas");
    const highResCtx = highResCanvas.getContext("2d", {
      willReadFrequently: true,
    });

    // Set to 2x resolution for better quality
    highResCanvas.width = canvas.width * 2;
    highResCanvas.height = canvas.height * 2;

    if (highResCtx) {
      highResCtx.scale(2, 2);
      highResCtx.drawImage(canvas, 0, 0);

      // Convert to blob
      highResCanvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], "nft-artwork.png", {
              type: "image/png",
            });
            const url = URL.createObjectURL(blob);
            onImageGenerated(file, url);
          }
        },
        "image/png",
        1.0
      );
    }
  }, [onImageGenerated]);

  // Handle tool change
  const handleToolChange = useCallback(
    (tool: CanvasTool) => {
      // Reset any active tool states
      setIsDrawing(false);
      clearTempCanvas();

      if (currentTool === "polygon" && polygonToolState.isDrawing) {
        setPolygonToolState({
          points: [],
          isDrawing: false,
          tempEndX: 0,
          tempEndY: 0,
        });
      }

      if (currentTool === "text" && textToolState.isPlacing) {
        setTextToolState({
          x: 0,
          y: 0,
          text: "",
          fontSize: fontSize,
          fontFamily: fontFamily,
          isPlacing: false,
        });
        setShowTextInput(false);
      }

      if (currentTool === "selection" && selectionToolState.selectedImageData) {
        setSelectionToolState({
          startX: 0,
          startY: 0,
          endX: 0,
          endY: 0,
          isSelecting: false,
          selectedImageData: null,
          isDragging: false,
          dragStartX: 0,
          dragStartY: 0,
        });
      }

      setCurrentTool(tool);
    },
    [
      currentTool,
      polygonToolState.isDrawing,
      textToolState.isPlacing,
      selectionToolState.selectedImageData,
      fontSize,
      fontFamily,
      clearTempCanvas,
    ]
  );

  // Handle color change
  const handleColorChange = useCallback((color: string) => {
    setCurrentColor(color);
  }, []);

  // Handle brush size change
  const handleBrushSizeChange = useCallback((size: number) => {
    setBrushSize(size);
  }, []);

  // Handle fill mode toggle
  const handleFillModeToggle = useCallback(() => {
    setIsFilled((prev) => !prev);
  }, []);

  // Handle clear confirmation
  const handleClearConfirm = useCallback(() => {
    setShowConfirmClear(true);
  }, []);

  // Handle background change
  const handleBackgroundChange = useCallback((background: string) => {
    setCurrentBackground(background);

    if (!canvasRef.current) return;

    // Apply background to canvas
    const canvas = canvasRef.current;

    // Reset any previous background styles
    canvas.style.backgroundColor = "";
    canvas.style.backgroundImage = "";
    canvas.style.backgroundSize = "";

    // Apply the selected background
    switch (background) {
      case "transparent":
        canvas.style.backgroundColor = "transparent";
        break;
      case "white":
        canvas.style.backgroundColor = "#ffffff";
        break;
      case "black":
        canvas.style.backgroundColor = "#000000";
        break;
      case "dark-gray":
        canvas.style.backgroundColor = "#1a1a1a";
        break;
      case "navy":
        canvas.style.backgroundColor = "#000080";
        break;
      case "deep-purple":
        canvas.style.backgroundColor = "#301934";
        break;
      case "canvas-texture":
        canvas.style.backgroundColor = "#f5f5dc";
        canvas.style.backgroundImage = "url('/canvas-texture.png')";
        break;
      case "circuit":
        canvas.style.backgroundColor = "#0a0a0a";
        canvas.style.backgroundImage = "url('/circuit-pattern.png')";
        break;
      case "hex-grid":
        canvas.style.backgroundColor = "#0a192f";
        canvas.style.backgroundImage = "url('/hex-grid.png')";
        break;
      case "digital-noise":
        canvas.style.backgroundColor = "#111";
        canvas.style.backgroundImage = "url('/digital-noise.png')";
        break;
      case "neon-gradient":
        canvas.style.backgroundImage =
          "linear-gradient(135deg, #00f5ff, #9d00ff)";
        break;
      case "cyber-gradient":
        canvas.style.backgroundImage =
          "linear-gradient(135deg, #ff00ff, #00f5ff)";
        break;
      case "green-gradient":
        canvas.style.backgroundImage =
          "linear-gradient(135deg, #39ff14, #00f5ff)";
        break;
      case "parchment":
        canvas.style.backgroundColor = "#f5f0e1";
        canvas.style.backgroundImage = "url('/parchment.png')";
        break;
      case "sketch":
        canvas.style.backgroundColor = "#ffffff";
        canvas.style.backgroundImage = "url('/sketch-paper.png')";
        break;
      case "holographic":
        canvas.style.backgroundImage =
          "linear-gradient(135deg, #ff00ff, #00f5ff, #39ff14)";
        break;
      case "matrix":
        canvas.style.backgroundColor = "#000";
        canvas.style.backgroundImage = "url('/matrix-pattern.png')";
        break;
      case "geometric":
        canvas.style.backgroundColor = "#0a0a0a";
        canvas.style.backgroundImage = "url('/geometric-mesh.png')";
        break;
      case "grid":
        canvas.style.backgroundColor = "#ffffff";
        canvas.style.backgroundImage = "url('/grid-pattern.png')";
        canvas.style.backgroundSize = "20px 20px";
        break;
      case "dots":
        canvas.style.backgroundColor = "#ffffff";
        canvas.style.backgroundImage =
          "radial-gradient(circle, #000000 1px, transparent 1px)";
        canvas.style.backgroundSize = "20px 20px";
        break;
      default:
        // If it starts with #, it's a custom color
        if (background.startsWith("#")) {
          canvas.style.backgroundColor = background;
        }
    }
  }, []);

  // Update cursor based on current tool
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    switch (currentTool) {
      case "brush":
        canvas.style.cursor =
          'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="3"/></svg>\') 12 12, auto';
        break;
      case "eraser":
        canvas.style.cursor =
          'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="8" y="8" width="8" height="8" rx="2"/></svg>\') 12 12, auto';
        break;
      case "line":
        canvas.style.cursor = "crosshair";
        break;
      case "rectangle":
      case "circle":
        canvas.style.cursor = "crosshair";
        break;
      case "polygon":
        canvas.style.cursor = "crosshair";
        break;
      case "text":
        canvas.style.cursor = "text";
        break;
      case "fill":
        canvas.style.cursor =
          'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 11h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2z"/></svg>\') 12 12, auto';
        break;
      case "eyedropper":
        canvas.style.cursor =
          'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/></svg>\') 12 12, auto';
        break;
      case "selection":
        canvas.style.cursor = "default";
        break;
      default:
        canvas.style.cursor = "default";
    }
  }, [currentTool]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex-grow flex flex-col">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 text-transparent bg-clip-text">
            Create Your NFT Artwork
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFillModeToggle}
              className={`px-3 py-1 rounded-md text-sm ${
                isFilled
                  ? "bg-cyan-900/50 text-cyan-400 shadow-lg shadow-cyan-500/20"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-300"
              }`}
            >
              {isFilled ? "Filled" : "Outline"}
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-medium transition-all duration-300 shadow-lg shadow-purple-500/20 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Save NFT
            </button>
          </div>
        </div>

        <div className="relative flex-grow flex justify-center items-center bg-gray-950/50 rounded-lg border border-gray-800/50 overflow-hidden">
          {/* Canvas grid background */}
          <div className="absolute inset-0 bg-[url('/scale.svg')] opacity-5"></div>

          {/* Main canvas */}
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="relative z-10 touch-none shadow-2xl shadow-cyan-500/10 border border-gray-800/50 rounded-lg"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />

          {/* Temporary canvas for previews */}
          <canvas
            ref={tempCanvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="absolute z-20 touch-none pointer-events-none"
            style={{
              top: 0,
              left: 0,
              width: canvasSize.width,
              height: canvasSize.height,
            }}
          />
        </div>

        <CanvasToolbar
          currentTool={currentTool}
          setCurrentTool={handleToolChange}
          currentColor={currentColor}
          setCurrentColor={handleColorChange}
          brushSize={brushSize}
          setBrushSize={handleBrushSizeChange}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClear={handleClearConfirm}
          canUndoRedo={{
            canUndo: history.length > 1,
            canRedo: redoStack.length > 0,
          }}
          currentBackground={currentBackground}
          onBackgroundChange={handleBackgroundChange}
        />
      </div>

      {/* Text Input Modal */}
      {showTextInput && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-medium text-white mb-4">Enter Text</h3>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white mb-4"
              placeholder="Enter your text here..."
              autoFocus
            />
            <div className="flex flex-col space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Font Size
                </label>
                <input
                  type="range"
                  min="10"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number.parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-right text-sm text-gray-400">
                  {fontSize}px
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Font Family
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                >
                  <option value="Arial">Arial</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Trebuchet MS">Trebuchet MS</option>
                  <option value="Impact">Impact</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowTextInput(false);
                  setTextToolState((prev) => ({ ...prev, isPlacing: false }));
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTextSubmit}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md text-white transition-colors"
              >
                Add Text
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear confirmation modal */}
      {showConfirmClear && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-medium text-white mb-4">
              Clear Canvas?
            </h3>
            <p className="text-gray-400 mb-6">
              This action cannot be undone. Are you sure you want to clear the
              canvas?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={clearCanvas}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
