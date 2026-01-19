"use client";

import React, { useState, useRef } from 'react';
import { XMarkIcon, PhotoIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface MultiImageUploadProps {
  label?: string;
  required?: boolean;
  images: string[];
  onChange: (images: string[]) => void;
  disabled?: boolean;
  maxSize?: number; // in MB
  maxImages?: number;
  acceptedTypes?: string[];
  columns?: 2 | 3 | 4 | 5 | 6;
  onError?: (message: string) => void;
  cloudinaryPreset?: string;
  cloudinaryCloudName?: string;
}

const MultiImageUpload = ({
  label = "Images",
  required = false,
  images,
  onChange,
  disabled = false,
  maxSize = 5,
  maxImages,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  columns = 4,
  onError,
  cloudinaryPreset = "domus-console",
  cloudinaryCloudName = "dviigplcx",
}: MultiImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSize * 1024 * 1024;

  const showError = (message: string) => {
    if (onError) {
      onError(message);
    } else {
      console.error(message);
    }
  };

  // Upload single file to Cloudinary
  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryPreset);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.status}`);
      }

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response from server');
      }

      const result = await res.json();
      if (!result || !result.secure_url) {
        throw new Error('Invalid response from server');
      }

      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return null;
    }
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Check max images limit
    if (maxImages && images.length + files.length > maxImages) {
      showError(`You can only upload up to ${maxImages} images`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    const validFiles: File[] = [];

    // Validate files first
    Array.from(files).forEach((file) => {
      if (!acceptedTypes.includes(file.type)) {
        showError(`${file.name} is not a valid image type`);
        return;
      }
      if (file.size > maxSizeBytes) {
        showError(`${file.name} is too large (max ${maxSize}MB)`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length === 0) {
      setIsUploading(false);
      return;
    }

    try {
      const uploadedUrls: string[] = [];
      
      // Upload files sequentially to track progress
      for (let i = 0; i < validFiles.length; i++) {
        const url = await uploadToCloudinary(validFiles[i]);
        if (url) {
          uploadedUrls.push(url);
        } else {
          showError(`Failed to upload ${validFiles[i].name}`);
        }
        setUploadProgress(Math.round(((i + 1) / validFiles.length) * 100));
      }

      if (uploadedUrls.length > 0) {
        onChange([...images, ...uploadedUrls]);
      }
    } catch (error) {
      showError('Error uploading images');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };


  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const getAcceptString = () => {
    return acceptedTypes.join(',');
  };

  const getFileTypesLabel = () => {
    const typeMap: Record<string, string> = {
      'image/jpeg': 'JPG',
      'image/png': 'PNG',
      'image/gif': 'GIF',
      'image/webp': 'WEBP',
      'image/svg+xml': 'SVG',
    };
    return acceptedTypes.map(type => typeMap[type] || type.split('/')[1]?.toUpperCase()).join(', ');
  };

  const gridColsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

    
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileSelect(e.target.files)}
        multiple
        accept={getAcceptString()}
        className="hidden"
        disabled={disabled}
      />

    
      {!disabled && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
          className={`
            relative border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all duration-200
            ${isDragging 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'
            }
          `}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            {isUploading ? (
              <>
                <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-600">
                  Uploading images... {uploadProgress > 0 && `${uploadProgress}%`}
                </p>
                {uploadProgress > 0 && (
                  <div className="w-full max-w-xs bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-red-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <CloudArrowUpIcon className="w-10 h-10 text-gray-400" />
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700">
                    {isDragging ? 'Drop images here' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {getFileTypesLabel()} up to {maxSize}MB each
                    {maxImages && ` (max ${maxImages} images)`}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    
      {images.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-2">
            {images.length} image(s) selected
            {maxImages && ` / ${maxImages} max`}
          </p>
          <div className={`grid ${gridColsClass[columns]} gap-3`}>
            {images.map((url, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
              >
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error';
                  }}
                />
               
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                  {index + 1}
                </span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length === 0 && disabled && (
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-center">
            <PhotoIcon className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-sm text-gray-500 mt-2">No images available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;
