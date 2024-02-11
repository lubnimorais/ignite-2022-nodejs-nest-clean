export interface IUploadParams {
  fileName: string;
  fileType: string;
  body: Buffer;
}

export abstract class Uploader {
  abstract upload({
    fileName,
    fileType,
    body,
  }: IUploadParams): Promise<{ url: string }>;
}
