"use client";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export function useBreedImages() {
  const [dbImages, setDbImages] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from("breed_images")
      .select("id, image_url")
      .then(({ data }) => {
        if (data) {
          const map: Record<string, string> = {};
          data.forEach((row: { id: string; image_url: string }) => {
            map[row.id] = row.image_url;
          });
          setDbImages(map);
        }
        setLoaded(true);
      });
  }, []);

  // DB 이미지가 있으면 DB 사용, 없으면 fallback
  // loaded가 false이면 fallback을 그대로 반환 (깜빡임 방지)
  const getImage = (breedId: string, fallback: string) => {
    if (!loaded) return fallback;
    return dbImages[breedId] || fallback;
  };

  return { getImage, loaded };
}
