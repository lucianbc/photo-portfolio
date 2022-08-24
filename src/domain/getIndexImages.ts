import * as fs from "fs/promises";
import * as is from "image-size";

const BASE_PATH = "./public/photos/Index";

export type Image = {
  path: string;
  aspectRatio: number;
};

export const getIndexImages = async (): Promise<Image[]> => {
  const files = await fs.readdir(BASE_PATH);
  const allFiles = files.map((filename) => {
    const path = `${BASE_PATH}/${filename}`;
    const { width, height } = is.imageSize(path);

    return {
      path,
      aspectRatio: width / height,
    };
  });
  return allFiles;
};

// getIndexImages();
