// services/systemMonitor.js
import { createSystemAlert } from "../controllers/adminAlertController.js";
import User from "../models/User.js";

export const monitorSystemHealth = () => {
  // Monitor API response times
  setInterval(async () => {
    const start = Date.now();

    try {
      // Simple database query to check response time
      await User.findOne().lean();
      const responseTime = Date.now() - start;

      if (responseTime > 1000) {
        // Slow response (>1 second)
        await createSystemAlert("system_performance", {
          type: "slow_response",
          responseTime,
          threshold: "1000ms",
          timestamp: new Date(),
        });
      }
    } catch (error) {
      await createSystemAlert("system_error", {
        type: "database_error",
        message: error.message,
        timestamp: new Date(),
      });
    }
  }, 60000); // Check every minute

  // Monitor memory usage
  setInterval(() => {
    const mem = process.memoryUsage();
    const heapUsedMB = (mem.heapUsed / 1024 / 1024).toFixed(2);
    const heapTotalMB = (mem.heapTotal / 1024 / 1024).toFixed(2);
    console.log(`Memory: Heap Used ${heapUsedMB}MB / Total ${heapTotalMB}MB`);

    if (mem.heapUsed > mem.heapTotal * 0.8) {
      // >80% heap usage
      createSystemAlert("system_performance", {
        type: "high_memory_usage",
        heapUsed: heapUsedMB,
        heapTotal: heapTotalMB,
        timestamp: new Date(),
      });
    }
  }, 60000); // Check every minute

  // Monitor error rates
  let errorCount = 0;
  let totalRequests = 0;

  setInterval(async () => {
    const errorRate =
      totalRequests > 0 ? (errorCount / totalRequests) * 100 : 0;

    if (errorRate > 5) {
      // >5% error rate
      await createSystemAlert("system_performance", {
        type: "high_error_rate",
        errorRate: errorRate.toFixed(2),
        errorCount,
        totalRequests,
        timeframe: "5 minutes",
      });
    }

    // Reset counters
    errorCount = 0;
    totalRequests = 0;
  }, 300000); // Every 5 minutes

  return {
    incrementRequests: () => totalRequests++,
    incrementErrors: () => errorCount++,
  };
};
