"use client";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

// DB에서 관리자가 업로드한 이미지를 가져오는 훅
// DB에 이미지가 있으면 DB 이미지 사용, 없으면 기본(Pixabay) 이미지 사용
export function useBreedImages() {
  const [dbImages, setDbImages] = useState<Record<string, string>>({});

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
      });
  }, []);

  // breedId로 이미지 URL 가져오기 (DB 우선, 없으면 fallback)
  const getImage = (breedId: string, fallback: string) => {
    return dbImages[breedId] || fallback;
  };

  return { getImage, dbImages };
}
