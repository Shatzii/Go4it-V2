export const smsTemplates = {
  payment_confirmation: (data: { amount: number; description: string }) =>
    `✅ Payment confirmed: $${data.amount} for ${data.description}. Thank you for choosing Go4It Sports!`,
  gar_score_update: (data: { score: number; improvement: string }) =>
    `🏆 GAR Analysis Complete! Your score: ${data.score}/100. ${data.improvement}`,
  coach_reminder: (data: { coachName: string; time: string; type: string }) =>
    `⏰ Reminder: ${data.type} with ${data.coachName} in 30 minutes (${data.time}).`,
  emergency_alert: (data: { type: string; message: string }) =>
    `🚨 ALERT: ${data.type} - ${data.message}.`,
  parent_update: (data: { childName: string; achievements: string }) =>
    `📈 ${data.childName}'s Weekly Progress: ${data.achievements}. Amazing work!`,
};
