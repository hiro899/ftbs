import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import formidable, { IncomingForm } from 'formidable';
import { promisify } from 'util';
import fs from 'fs';

const readFile = promisify(fs.readFile);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let data;
    try {
      data = await new Promise((resolve, reject) => {
        const form = new IncomingForm({ maxFileSize: 100 * 1024 * 1024 }); // 100MB

        form.parse(req, (err, fields, files) => {
          if (err) return reject(err);
          resolve({ fields, files });
        });
      });
    } catch (err) {
      return res.status(500).json({ error: 'Error parsing form.', details: err.message });
    }

    const style = data.fields.style[0];
    const file = data.files.file[0];

    try {
      const fileData = await readFile(file.filepath);

      const uploadParams = {
        Bucket: "aibotimages",
        Key: `images/${Date.now()}-${file.originalFilename}`,
        Body: fileData,
        ContentType: file.mimetype,
        Metadata: {
          style,
        },
      };

      // Create an S3 client
      const s3Client = new S3Client({ region: 'ap-northeast-1' });

      // Create a new PutObjectCommand with the upload parameters
      const command = new PutObjectCommand(uploadParams);

      // Send the command to the S3 client
      try {
        await s3Client.send(command);
        res.status(200).json({ success: true, message: 'File uploaded successfully' });
      } catch (err) {
        return res.status(500).json({ error: 'Error uploading file.', details: err.message });
      }
    } catch (err) {
      return res.status(500).json({ error: 'Error reading file.', details: err.message });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed. Please use POST.' });
  }
}
