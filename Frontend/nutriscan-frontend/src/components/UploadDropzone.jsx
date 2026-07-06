import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, ImageOff, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UploadDropzone({ onFileSelected, preview, onClear }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files) => {
      const file = files?.[0];
      if (file && file.type.startsWith('image/')) {
        onFileSelected(file);
      }
    },
    [onFileSelected]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  if (preview) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-2xl border border-border"
      >
        <img src={preview} alt="Food preview" className="max-h-72 w-full object-cover" />
        <button
          onClick={onClear}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
          aria-label="Remove image"
        >
          <X size={15} />
        </button>
      </motion.div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-colors',
        isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent/50'
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        {isDragging ? <UploadCloud size={22} /> : <ImageOff size={22} />}
      </div>
      <div>
        <p className="text-sm font-medium">Drop a photo here, or tap to browse</p>
        <p className="mt-1 text-xs text-muted-foreground">Nutrition label or the food itself — JPG, PNG</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
