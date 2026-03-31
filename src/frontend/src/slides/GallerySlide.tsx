import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const WARM_BG = "#FFF8EE";
const WARM_PAPER = "#F5ECD7";
const WARM_MOCHA = "#5C3D2E";
const WARM_BROWN = "#8B6F47";
const WARM_GOLD = "#D4A853";
const _WARM_TEXT = "#3D2B1F";
const WARM_BORDER = "rgba(139,111,71,0.25)";
const WARM_MUTED = "rgba(92,61,46,0.5)";

interface GalleryPhoto {
  id: string;
  src: string;
  uploader: string;
  timestamp: string;
  likes: number;
}

interface User {
  username: string;
  bio: string;
  createdAt: string;
}

export default function GallerySlide({
  currentUser,
}: { currentUser: User | null }) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored: GalleryPhoto[] = JSON.parse(
      localStorage.getItem("chinnua_gallery") || "[]",
    );
    const liked: string[] = JSON.parse(
      localStorage.getItem("chinnua_gallery_liked") || "[]",
    );
    setPhotos(stored);
    setLikedPhotos(new Set(liked));
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const photo: GalleryPhoto = {
        id: `photo_${Date.now()}`,
        src: ev.target?.result as string,
        uploader: currentUser?.username || "Anonymous",
        timestamp: new Date().toISOString(),
        likes: 0,
      };
      const stored: GalleryPhoto[] = JSON.parse(
        localStorage.getItem("chinnua_gallery") || "[]",
      );
      stored.unshift(photo);
      localStorage.setItem("chinnua_gallery", JSON.stringify(stored));
      setPhotos((prev) => [photo, ...prev]);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleLike = (photoId: string) => {
    const newLiked = new Set(likedPhotos);
    const likes: Record<string, number> = JSON.parse(
      localStorage.getItem("chinnua_gallery_likes") || "{}",
    );
    if (newLiked.has(photoId)) {
      newLiked.delete(photoId);
      likes[photoId] = Math.max(0, (likes[photoId] ?? 1) - 1);
    } else {
      newLiked.add(photoId);
      likes[photoId] = (likes[photoId] ?? 0) + 1;
    }
    localStorage.setItem("chinnua_gallery_likes", JSON.stringify(likes));
    localStorage.setItem(
      "chinnua_gallery_liked",
      JSON.stringify([...newLiked]),
    );
    setLikedPhotos(newLiked);
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, likes: likes[photoId] } : p)),
    );
  };

  const openFileDialog = () => fileRef.current?.click();

  return (
    <div
      style={{
        background: WARM_BG,
        overflowY: "auto",
        paddingBottom: "2rem",
        minHeight: "100vh",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem 1rem" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.6rem",
              color: WARM_MOCHA,
              fontWeight: 700,
            }}
          >
            Photo Gallery
          </h2>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            style={{ display: "none" }}
          />
          <Button
            onClick={openFileDialog}
            data-ocid="gallery.upload_button"
            style={{
              background: `linear-gradient(135deg, ${WARM_GOLD}, ${WARM_BROWN})`,
              border: "none",
              color: "#3D2B1F",
              fontFamily: "'Libre Baskerville', Georgia, serif",
            }}
          >
            Upload Photo
          </Button>
        </div>

        {photos.length === 0 ? (
          <button
            type="button"
            style={{
              width: "100%",
              textAlign: "center",
              padding: "4rem 2rem",
              border: `2px dashed ${WARM_BORDER}`,
              borderRadius: 12,
              cursor: "pointer",
              background: "transparent",
              color: "inherit",
            }}
            onClick={openFileDialog}
            data-ocid="gallery.empty_state"
          >
            <p
              style={{
                color: WARM_MUTED,
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.1rem",
                marginBottom: "0.5rem",
              }}
            >
              No photos yet
            </p>
            <p
              style={{
                color: WARM_GOLD,
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.85rem",
              }}
            >
              Upload the first photo
            </p>
          </button>
        ) : (
          <div style={{ columns: "2 220px", gap: "1rem" }}>
            {photos.map((photo, idx) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                className="feed-card"
                style={{
                  marginBottom: "1rem",
                  overflow: "hidden",
                  breakInside: "avoid",
                  padding: 0,
                }}
                data-ocid={`gallery.item.${idx + 1}`}
              >
                <img
                  src={photo.src}
                  alt={`Shared by ${photo.uploader}`}
                  style={{ width: "100%", display: "block" }}
                />
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: WARM_PAPER,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      fontSize: "0.8rem",
                      color: WARM_BROWN,
                    }}
                  >
                    {photo.uploader}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLike(photo.id)}
                    data-ocid="gallery.toggle"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: likedPhotos.has(photo.id) ? "#c0392b" : WARM_BROWN,
                      fontSize: "0.82rem",
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill={likedPhotos.has(photo.id) ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      role="img"
                      aria-label="Like"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    {photo.likes}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
