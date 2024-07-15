import { Injectable } from '@nestjs/common';

import sharp from 'sharp';
import { v4 as uuidV4 } from 'uuid';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

import { FileFolder } from 'src/engine/core-modules/file/interfaces/file-folder.interface';

import { getCropSize } from 'src/utils/image';
import { settings } from 'src/engine/constants/settings';
import { FileStorageService } from 'src/engine/integrations/file-storage/file-storage.service';

@Injectable()
export class FileUploadService {
  constructor(private readonly fileStorage: FileStorageService) {}

  private async _uploadFile({
    file,
    filename,
    mimeType,
    fileFolder,
  }: {
    file: Buffer | Uint8Array | string;
    filename: string;
    mimeType: string | undefined;
    fileFolder: FileFolder | string;
  }) {
    await this.fileStorage.write({
      file,
      name: filename,
      mimeType,
      folder: fileFolder,
    });
  }

  private _sanitizeFile({
    file,
    ext,
    mimeType,
  }: {
    file: Buffer | Uint8Array | string;
    ext: string;
    mimeType: string | undefined;
  }): Buffer | Uint8Array | string {
    if (ext === 'svg' || mimeType === 'image/svg+xml') {
      const window = new JSDOM('').window;
      const purify = DOMPurify(window);

      return purify.sanitize(file.toString());
    }

    return file;
  }

  async uploadFile({
    file,
    filename,
    mimeType,
    fileFolder,
    forceName = false,
  }: {
    file: Buffer | Uint8Array | string;
    filename: string;
    mimeType: string | undefined;
    fileFolder: FileFolder | string;
    forceName?: boolean;
  }) {
    const ext = filename.split('.')?.[1];
    const id = uuidV4();
    const name = forceName ? filename : `${id}${ext ? `.${ext}` : ''}`;

    await this._uploadFile({
      file: this._sanitizeFile({ file, ext, mimeType }),
      filename: name,
      mimeType,
      fileFolder,
    });

    return {
      id,
      mimeType,
      path: `${fileFolder}/${name}`,
    };
  }

  async uploadImage({
    file,
    filename,
    mimeType,
    fileFolder,
  }: {
    file: Buffer | Uint8Array | string;
    filename: string;
    mimeType: string | undefined;
    fileFolder: FileFolder;
  }) {
    const ext = filename.split('.')?.[1];
    const id = uuidV4();
    const name = `${id}${ext ? `.${ext}` : ''}`;

    const cropSizes = settings.storage.imageCropSizes[fileFolder];

    if (!cropSizes) {
      throw new Error(`No crop sizes found for ${fileFolder}`);
    }

    const sizes = cropSizes.map((shortSize) => getCropSize(shortSize));
    const images = await Promise.all(
      sizes.map((size) =>
        sharp(file).resize({
          [size?.type || 'width']: size?.value ?? undefined,
        }),
      ),
    );

    const paths: Array<string> = [];

    await Promise.all(
      images.map(async (image, index) => {
        const buffer = await image.toBuffer();

        paths.push(`${fileFolder}/${cropSizes[index]}/${name}`);

        return this._uploadFile({
          file: buffer,
          filename: `${cropSizes[index]}/${name}`,
          mimeType,
          fileFolder,
        });
      }),
    );

    return {
      id,
      mimeType,
      paths,
    };
  }
}
