import fileUpload from 'express-fileupload';

export const fileUploadCloudinary = fileUpload({
  useTempFiles: true,
  tempFileDir: "./uploads",
});

