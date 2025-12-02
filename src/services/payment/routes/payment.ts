import { Router, Request, Response } from 'express';
import { authMiddleware } from '../../../shared/middleware/auth';
import { db } from '../../../shared/lib/firebase';
import admin from '../../../shared/lib/firebase';
import {
  CheckoutRequest,
  CheckoutResponse,
  PaymentConfirmRequest,
} from '../types/payment';

const router = Router();

// POST /api/payment/checkout
router.post('/checkout', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { amount } = req.body as CheckoutRequest;

    const orderId = `order_${Date.now()}_${userId}`;

    const response: CheckoutResponse = {
      orderId,
      amount: amount || 5000,
      orderName: 'AI 동화책 생성권',
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/payment/confirm
router.post('/confirm', async (req: Request, res: Response) => {
  try {
    const { paymentKey, orderId, amount } = req.body as PaymentConfirmRequest;

    // TossPayments 승인 API 호출
    const response = await fetch(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.TOSS_SECRET_KEY + ':'
          ).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentKey, orderId, amount }),
      }
    );

    const payment = await response.json();

    if ((payment as unknown as { status: string }).status === 'DONE') {
      // orderId에서 userId 추출
      const userId = orderId.split('_')[2];

      // 크레딧 충전
      await db.collection('users').doc(userId).update({
        credits: admin.firestore.FieldValue.increment(1),
      });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;