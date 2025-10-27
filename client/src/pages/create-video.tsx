import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertVideoSchema, type InsertVideo } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, Upload, Video as VideoIcon, X, Play } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CreateVideo() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<InsertVideo>({
    resolver: zodResolver(insertVideoSchema),
    defaultValues: {
      videoUrl: "",
      title: "",
      description: undefined,
      thumbnailUrl: undefined,
      duration: undefined,
      author: "",
      avatarUrl: undefined,
    },
  });

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [previewUrl, thumbnailPreview]);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        const duration = Math.floor(video.duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        form.setValue("duration", `${minutes}:${seconds.toString().padStart(2, "0")}`);
      };
      video.src = url;
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a valid video file",
        variant: "destructive",
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileClear = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const createMutation = useMutation({
    mutationFn: async (data: InsertVideo) => {
      return await apiRequest("POST", "/api/videos", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      toast({
        title: "Video uploaded",
        description: "Your video has been uploaded successfully.",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: InsertVideo) => {
    if (!selectedFile) {
      toast({
        title: "No video selected",
        description: "Please select a video file to upload",
        variant: "destructive",
      });
      return;
    }

    let videoUrl = data.videoUrl;
    let thumbnailUrl = data.thumbnailUrl;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("video", selectedFile);

      const uploadInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch("/api/upload-video", {
        method: "POST",
        body: formData,
      });

      clearInterval(uploadInterval);

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      videoUrl = result.videoUrl;
      setUploadProgress(100);

      if (thumbnailFile) {
        const thumbFormData = new FormData();
        thumbFormData.append("image", thumbnailFile);

        const thumbResponse = await fetch("/api/upload", {
          method: "POST",
          body: thumbFormData,
        });

        if (thumbResponse.ok) {
          const thumbResult = await thumbResponse.json();
          thumbnailUrl = thumbResult.imageUrl;
        }
      }

      createMutation.mutate({
        ...data,
        videoUrl,
        thumbnailUrl,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const authorName = form.watch("author") || "Anonymous";
  const initials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-5xl mx-auto py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Feed
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                  <VideoIcon className="h-6 w-6 text-white" />
                </div>
                Upload Video
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
                  isDragging
                    ? "border-primary bg-primary/5 scale-[1.02]"
                    : selectedFile
                    ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {!selectedFile ? (
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Drop your video here
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      or click the button below to browse
                    </p>
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      data-testid="button-select-video"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Select Video File
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">
                      Supports MP4, MOV, AVI, MKV, WEBM (max 100MB)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-green-500">
                            <VideoIcon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold truncate">
                              {selectedFile.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        {previewUrl && (
                          <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                            <video
                              src={previewUrl}
                              controls
                              className="w-full h-full"
                              data-testid="video-preview"
                            />
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleFileClear}
                        data-testid="button-clear-video"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {isUploading && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Uploading...</span>
                          <span className="font-semibold">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                  data-testid="input-video-file"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Video Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter video title"
                            {...field}
                            data-testid="input-title"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell viewers about your video"
                            className="resize-none"
                            rows={4}
                            {...field}
                            value={field.value || ""}
                            data-testid="input-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Creator Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your name"
                            {...field}
                            data-testid="input-author"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Picture URL (optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/avatar.jpg"
                            {...field}
                            value={field.value || ""}
                            data-testid="input-avatar"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Thumbnail (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!thumbnailPreview ? (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <div className="mx-auto w-12 h-12 mb-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Add a custom thumbnail
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => thumbnailInputRef.current?.click()}
                      data-testid="button-select-thumbnail"
                    >
                      Choose Image
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                        data-testid="img-thumbnail-preview"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                      onClick={() => {
                        setThumbnailFile(null);
                        setThumbnailPreview("");
                        if (thumbnailInputRef.current) {
                          thumbnailInputRef.current.value = "";
                        }
                      }}
                      data-testid="button-clear-thumbnail"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailSelect}
                  className="hidden"
                  data-testid="input-thumbnail-file"
                />
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-semibold mb-3">Preview</h3>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={form.watch("avatarUrl") || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {form.watch("title") || "Video Title"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {authorName}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                disabled={!selectedFile || isUploading || createMutation.isPending}
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                size="lg"
                data-testid="button-submit"
              >
                {isUploading ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-pulse" />
                    Uploading... {uploadProgress}%
                  </>
                ) : createMutation.isPending ? (
                  "Publishing..."
                ) : (
                  <>
                    <VideoIcon className="h-4 w-4 mr-2" />
                    Publish Video
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
