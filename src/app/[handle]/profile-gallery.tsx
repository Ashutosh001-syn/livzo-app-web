"use client";

import { useState, useEffect, useRef } from "react";
import { Heart, MessageCircle, Share2, X, Send } from "lucide-react";
import { useSocket } from "@/components/providers/socket-provider";
import { Button } from "@/components/ui/button";

interface Photo {
  id: string;
  url: string;
  initialLikes: number;
}

interface Comment {
  id: string;
  text: string;
  user: { id: string; displayName: string };
  timestamp: string;
}

export function ProfileGallery({ photos, currentUser }: { photos: Photo[], currentUser: { id: string, displayName: string } }) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const { socket, isConnected } = useSocket();
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to bottom of comments
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  useEffect(() => {
    if (!socket || !selectedPhoto) return;

    // Join the specific photo room
    socket.emit("join_photo", selectedPhoto.id);
    setLikes(selectedPhoto.initialLikes);
    setHasLiked(false);
    // In a real app, we would fetch existing comments from DB here.
    // For now, we just clear them on new photo open.
    setComments([
      { id: "fake-1", text: "Stunning! 😍", user: { id: "u1", displayName: "Sarah J." }, timestamp: new Date().toISOString() },
      { id: "fake-2", text: "Love this shot so much 👏", user: { id: "u2", displayName: "Alex_99" }, timestamp: new Date().toISOString() }
    ]);

    const handleReceiveComment = (data: Comment) => {
      setComments((prev) => [...prev, data]);
    };

    const handleReceiveLike = (data: { id: string, user: { id: string, displayName: string } }) => {
      setLikes((prev) => prev + 1);
    };

    socket.on("receive_photo_comment", handleReceiveComment);
    socket.on("receive_photo_like", handleReceiveLike);

    return () => {
      socket.emit("leave_photo", selectedPhoto.id);
      socket.off("receive_photo_comment", handleReceiveComment);
      socket.off("receive_photo_like", handleReceiveLike);
    };
  }, [socket, selectedPhoto]);

  const handleLike = () => {
    // Show heart animation even if already liked for the visual effect
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 1000);

    if (!socket || !selectedPhoto || hasLiked) return;
    
    setHasLiked(true);
    setLikes(prev => prev + 1);
    socket.emit("like_photo", {
      photoId: selectedPhoto.id,
      user: currentUser
    });
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !selectedPhoto || !commentInput.trim()) return;

    socket.emit("comment_photo", {
      photoId: selectedPhoto.id,
      text: commentInput,
      user: currentUser
    });
    setCommentInput("");
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedPhoto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPhoto]);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-3 xl:gap-6">
        {photos.map((photo) => (
          <div 
            key={photo.id} 
            onClick={() => setSelectedPhoto(photo)}
            className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-900 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-blue-900/20" />
            <img 
              src={photo.url} 
              alt="Gallery Item"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
            />
            
            <div className="absolute inset-0 flex items-center justify-center gap-6 bg-black/50 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex items-center gap-2 text-lg font-bold text-white">
                <Heart className="size-6 fill-rose-500 text-rose-500" /> {photo.initialLikes}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Instagram-style Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-6 backdrop-blur-md">
          {/* Close Button */}
          <button 
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 z-[60] flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <X className="size-6" />
          </button>

          <div className="flex h-full max-h-[900px] w-full max-w-[1200px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 sm:flex-row shadow-2xl">
            
            {/* Left Side: Photo */}
            <div 
              className="relative flex flex-1 items-center justify-center bg-black select-none cursor-pointer"
              onDoubleClick={handleLike}
            >
              <img 
                src={selectedPhoto.url} 
                alt="Selected" 
                className="max-h-full max-w-full object-contain pointer-events-none"
              />
              
              {/* Double-tap Heart Animation */}
              {showHeartAnim && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 animate-in zoom-in-50 fade-in duration-300">
                  <Heart className="size-32 fill-white text-white drop-shadow-[0_0_25px_rgba(0,0,0,0.5)] opacity-90 animate-out zoom-out-50 fade-out duration-700 delay-300 fill-mode-forwards" />
                </div>
              )}
            </div>

            {/* Right Side: Comments and Interactions */}
            <div className="flex h-96 w-full flex-col border-l border-white/10 bg-zinc-950/80 sm:h-auto sm:w-[400px]">
              
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-white/10 p-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-lg font-bold text-white">
                  L
                </div>
                <div>
                  <h3 className="font-semibold text-white">LivZo Creator</h3>
                  <p className="text-xs text-zinc-400">Original Audio</p>
                </div>
              </div>

              {/* Comments Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-white">
                      {comment.user.displayName[0].toUpperCase()}
                    </div>
                    <div>
                      <span className="font-semibold text-white text-sm mr-2">
                        {comment.user.displayName}
                      </span>
                      <span className="text-sm text-zinc-300">{comment.text}</span>
                      <div className="mt-1 text-[10px] text-zinc-500">
                        {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={commentsEndRef} />
              </div>

              {/* Interaction Bar */}
              <div className="border-t border-white/10 p-4">
                <div className="mb-4 flex items-center gap-4">
                  <button onClick={handleLike} className="group transition">
                    <Heart className={`size-7 transition-colors ${hasLiked ? "fill-rose-500 text-rose-500" : "text-white group-hover:text-zinc-300"}`} />
                  </button>
                  <button className="group transition">
                    <MessageCircle className="size-7 text-white group-hover:text-zinc-300" />
                  </button>
                  <button className="group transition">
                    <Share2 className="size-7 text-white group-hover:text-zinc-300" />
                  </button>
                </div>
                <div className="mb-2 font-semibold text-white">
                  {likes.toLocaleString()} likes
                </div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4">
                  2 DAYS AGO
                </div>

                {/* Comment Input */}
                <form onSubmit={handleComment} className="relative flex items-center">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full rounded-full border border-white/10 bg-zinc-900/50 px-4 py-2.5 pr-10 text-sm text-white placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                  <button 
                    type="submit" 
                    disabled={!commentInput.trim() || !isConnected}
                    className="absolute right-2 flex size-7 items-center justify-center rounded-full bg-violet-600 text-white disabled:opacity-50"
                  >
                    <Send className="size-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
