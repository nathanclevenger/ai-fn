import { describe, test, expect, beforeEach } from 'vitest'
import { QueueManager } from '../manager'

describe('QueueManager', () => {
  let queueManager: QueueManager

  beforeEach(() => {
    queueManager = new QueueManager({ concurrency: 2 })
  })

  test('creates default queue with specified concurrency', () => {
    expect(queueManager.size()).toBe(0)
    expect(queueManager.pending()).toBe(0)
  })

  test('creates per-model queues', () => {
    const queue1 = queueManager.getQueue('gpt-4')
    const queue2 = queueManager.getQueue('gpt-3.5-turbo')

    expect(queue1).not.toBe(queue2)
  })

  test('reuses existing model queues', () => {
    const queue1 = queueManager.getQueue('gpt-4')
    const queue2 = queueManager.getQueue('gpt-4')

    expect(queue1).toBe(queue2)
  })

  test('respects concurrency limits', async () => {
    const delays = [100, 100, 100]
    const start = Date.now()

    const promises = delays.map((delay) => queueManager.add(() => new Promise((resolve) => setTimeout(resolve, delay))))

    await Promise.all(promises)
    const duration = Date.now() - start

    // With concurrency of 2, should take ~200ms (two 100ms in parallel, then one more)
    expect(duration).toBeGreaterThan(150)
  })

  test('handles priorities', async () => {
    const results: number[] = []

    // Add low priority task first
    queueManager.add(
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 50))
        results.push(2)
      },
      { priority: 1 },
    )

    // Add high priority task second
    queueManager.add(
      async () => {
        results.push(1)
      },
      { priority: 2 },
    )

    await queueManager.onIdle()

    // High priority task should complete first
    expect(results).toEqual([1, 2])
  })

  test('supports pause/resume/clear operations', async () => {
    queueManager.pause()

    const promise = queueManager.add(async () => 'test')
    expect(queueManager.pending()).toBe(0)
    expect(queueManager.size()).toBe(1)

    queueManager.resume()
    const result = await promise
    expect(result).toBe('test')

    queueManager.add(async () => 'test2')
    queueManager.clear()
    expect(queueManager.size()).toBe(0)
  })
})
