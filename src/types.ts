type Photo = {
  name: string;
};

type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };
