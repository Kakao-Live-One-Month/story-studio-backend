import { Router, Request, Response } from 'express';
import { authMiddleware } from '../../../shared/middleware/auth';
import { openai } from '../../../shared/lib/openai';
import { db } from '../../../shared/lib/firebase';
import admin from '../../../shared/lib/firebase';
import { GenerateStoryRequest, GenerateStoryResponse, Story } from '../types/story';

const router = Router();

// POST /api/story/generate
router.post('/generate', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body as GenerateStoryRequest;
    const userId = (req as any).userId as string;

    // GPT-4 호출
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: '동화를 3페이지로 생성해주세요. JSON 형식으로 반환하세요.',
        },
        { role: 'user', content: prompt },
      ],
    });

    const storyData = JSON.parse(completion.choices[0].message.content || '{}');

    const story: Story = {
      userId,
      title: storyData.title,
      pages: storyData.pages,
      status: 'generating',
    };

    const response: GenerateStoryResponse = { story };
    res.json(response);
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/story/save
router.post('/save', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { story } = req.body as { story: Story };
    const userId = req.userId!;

    // 트랜잭션
    const storyId = await db.runTransaction(async (transaction) => {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists || (userDoc.data()?.credits ?? 0) < 1) {
        throw new Error('Insufficient credits');
      }

      // 동화책 저장
      const storyRef = db.collection('stories').doc();
      transaction.set(storyRef, {
        ...story,
        userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 크레딧 차감
      transaction.update(userRef, {
        credits: admin.firestore.FieldValue.increment(-1),
      });

      return storyRef.id;
    });

    res.json({ storyId });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;