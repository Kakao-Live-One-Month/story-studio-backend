// src/services/upload/routes/upload.ts
import { Router, Request, Response } from 'express';
import multer from 'multer';
import { authMiddleware } from '../../../shared/middleware/auth';
import cloudinary from '../../../shared/lib/cloudinary';
import { db } from '../../../shared/lib/firebase';
import admin from '../../../shared/lib/firebase';

const router = Router();

// Multer 설정 (메모리 스토리지 사용)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB 제한
  },
  fileFilter: (req, file, cb) => {
    // 이미지 파일만 허용
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다.'));
    }
  },
});

// POST /api/upload/image
// 물리 파일은 Cloudinary에만 저장, Firestore에는 URL만 저장
router.post(
  '/image',
  authMiddleware,
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: '이미지 파일이 필요합니다.' });
        return;
      }

      const userId = req.userId!;
      const { folder, publicId, saveToFirestore } = req.body;

      // Cloudinary에 업로드 (물리 파일 저장)
      const uploadResult = await new Promise<{
        secure_url: string;
        public_id: string;
      }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder || `users/${userId}`,
            public_id: publicId,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as { secure_url: string; public_id: string });
          }
        );

        uploadStream.end(req.file!.buffer);
      });

      // Firestore에 URL만 저장 (물리 파일은 저장하지 않음)
      let uploadId: string | undefined;
      if (saveToFirestore !== 'false') {
        const uploadRef = db.collection('uploads').doc();
        await uploadRef.set({
          userId,
          url: uploadResult.secure_url, // Cloudinary URL만 저장
          publicId: uploadResult.public_id,
          folder: folder || `users/${userId}`,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        uploadId = uploadRef.id;
      }

      res.json({
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        uploadId, // Firestore에 저장한 경우에만 반환
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

// POST /api/upload/images (다중 이미지 업로드)
router.post(
  '/images',
  authMiddleware,
  upload.array('images', 10), // 최대 10개
  async (req: Request, res: Response) => {
    try {
      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        res.status(400).json({ error: '이미지 파일이 필요합니다.' });
        return;
      }

      const userId = req.userId!;
      const { folder, saveToFirestore } = req.body;
      const files = req.files as Express.Multer.File[];

      // Cloudinary에 업로드 (물리 파일 저장)
      const uploadPromises = files.map((file) => {
        return new Promise<{
          secure_url: string;
          public_id: string;
        }>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: folder || `users/${userId}`,
              resource_type: 'image',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as { secure_url: string; public_id: string });
            }
          );

          uploadStream.end(file.buffer);
        });
      });

      const uploadResults = await Promise.all(uploadPromises);

      // Firestore에 URL만 저장 (물리 파일은 저장하지 않음)
      const uploads = uploadResults.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));

      if (saveToFirestore !== 'false') {
        const batch = db.batch();
        uploadResults.forEach((result) => {
          const uploadRef = db.collection('uploads').doc();
          batch.set(uploadRef, {
            userId,
            url: result.secure_url, // Cloudinary URL만 저장
            publicId: result.public_id,
            folder: folder || `users/${userId}`,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        });
        await batch.commit();
      }

      res.json({ uploads });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

// DELETE /api/upload/:publicId
router.delete('/:publicId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { publicId } = req.params;
    const userId = req.userId!;

    // Cloudinary에서 물리 파일 삭제
    await cloudinary.uploader.destroy(publicId);

    // Firestore에서 URL 정보 삭제 (있는 경우)
    const uploadSnapshot = await db
      .collection('uploads')
      .where('publicId', '==', publicId)
      .where('userId', '==', userId)
      .limit(1)
      .get();

    if (!uploadSnapshot.empty) {
      await uploadSnapshot.docs[0].ref.delete();
    }

    res.json({ message: '파일이 삭제되었습니다.' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;