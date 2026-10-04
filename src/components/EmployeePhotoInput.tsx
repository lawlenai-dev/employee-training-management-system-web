import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Camera, ImagePlus, Upload } from "lucide-react";

type EmployeePhotoInputProps = {
  previewUrl?: string | null;
  onCapture: (file: File) => void;
  onPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
};

export function EmployeePhotoInput({
  previewUrl,
  onCapture,
  onPhotoChange,
  onRemove,
}: EmployeePhotoInputProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!cameraOpen) return;

    let cancelled = false;
    let stream: MediaStream | undefined;

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("กล้องต้องใช้งานผ่าน HTTPS หรือ localhost");
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const video = videoRef.current;
        if (!video) throw new Error("ไม่สามารถแสดงภาพจากกล้องได้");

        video.srcObject = stream;
        await video.play();

        if (!cancelled) setCameraReady(true);
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error && err.name === "NotAllowedError"
            ? "กรุณาอนุญาตให้เว็บไซต์เข้าถึงกล้อง"
            : err instanceof Error && err.name === "NotFoundError"
              ? "ไม่พบกล้องบนอุปกรณ์นี้"
              : err instanceof Error
                ? err.message
                : "ไม่สามารถเปิดกล้องได้",
        );

        setCameraOpen(false);
      }
    };

    void startCamera();

    return () => {
      cancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [cameraOpen]);

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) {
        setError("ไม่สามารถสร้างรูปภาพได้ กรุณาถ่ายใหม่");
        return;
      }

      onCapture(
        new File([blob], `employee-${Date.now()}.jpg`, {
          type: "image/jpeg",
        }),
      );

      setCameraOpen(false);
      setCameraReady(false);
    }, "image/jpeg", 0.9);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-700">
        รูปพนักงาน
      </p>

      {/* กรอบถ่ายรูป */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <div className="relative flex aspect-[4/3] max-h-80 items-center justify-center overflow-hidden bg-slate-950">
          {cameraOpen ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="h-full w-full object-contain"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <div className="h-[72%] w-[44%] rounded-[50%] border-2 border-dashed border-white/80" />
              </div>

              <span className="absolute bottom-3 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
                มองตรงและจัดใบหน้าให้อยู่ในกรอบ
              </span>
            </>
          ) : previewUrl ? (
            <img
              src={previewUrl}
              alt="รูปพนักงาน"
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <ImagePlus size={40} />
              <span className="text-sm">ยังไม่มีรูปพนักงาน</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <p className="text-sm font-semibold text-heading">
              ถ่ายรูปพนักงาน
            </p>
            <p className="mt-1 text-xs text-muted">
              ถ่ายหน้าตรง ในบริเวณที่มีแสงเพียงพอ
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {cameraOpen ? (
              <>
                <button
                  type="button"
                  disabled={!cameraReady}
                  onClick={capturePhoto}
                  className="inline-flex items-center gap-2 rounded-control bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Camera size={16} />
                  {cameraReady ? "ถ่ายรูป" : "กำลังเปิดกล้อง..."}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCameraOpen(false);
                    setCameraReady(false);
                  }}
                  className="rounded-control border border-border px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  ปิดกล้อง
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setCameraReady(false);
                    setCameraOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-control bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  <Camera size={16} />
                  {previewUrl ? "ถ่ายรูปใหม่" : "เปิดกล้อง"}
                </button>

                {previewUrl && (
                  <button
                    type="button"
                    onClick={onRemove}
                    className="rounded-control border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    ลบรูป
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {error && (
          <p role="alert" className="px-4 pb-4 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>

      {/* กรอบแนบไฟล์ด้านล่าง */}
      <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-heading">
            หรือแนบรูปจากอุปกรณ์
          </p>
          <p className="mt-1 text-xs leading-5 text-muted">
            รองรับ JPG, JPEG, PNG หรือ WEBP
          </p>
        </div>

        <label className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-control border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50">
          <Upload size={16} />
          เลือกรูปภาพ
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={cameraOpen}
            onChange={(event) => {
              onPhotoChange(event);
              event.target.value = "";
            }}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
}