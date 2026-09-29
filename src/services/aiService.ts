import type { AIResult } from '@/types';

/**
 * Demo AI image analysis service.
 *
 * This does NOT call any backend or real AI model.
 * It returns a simulated result so the classroom prototype
 * can be demonstrated end-to-end. The function signature is
 * designed so a real model can replace this implementation later.
 */
export async function analyzeImage(_image: string): Promise<AIResult> {
  // Simulate processing delay for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 1200));

  return {
    garbageDetected: true,
    confidence: 0.94,
    category: 'Garbage',
    mode: 'Demo AI',
  };
}
