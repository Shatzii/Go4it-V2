import { db } from '../server/db';
import { sql } from 'drizzle-orm';

// Function to create test workout data for a user
async function createTestWorkoutData(userId: number) {
  console.log(`Creating test workout data for user ID: ${userId}`);

  try {
    // First check if the user exists
    console.log(`Checking if user ${userId} exists...`);
    const userResult = await db.execute(sql`SELECT * FROM users WHERE id = ${userId}`);
    console.log('User query result:', JSON.stringify(userResult));
    
    // Try a direct query to verify connection is working
    const allUsers = await db.execute(sql`SELECT id, username FROM users LIMIT 3`);
    console.log('Sample users in database:', JSON.stringify(allUsers));
    
    // The db.execute() returns an object with a 'rows' property containing the results
    if (!userResult.rows || userResult.rows.length === 0) {
      console.error(`User with ID ${userId} not found in database`);
      return;
    }
    
    console.log(`Found user: ${userResult.rows[0].username}`);
    

    // Check if the user already has workout verifications
    const existingResult = await db.execute(sql`
      SELECT COUNT(*) as count FROM workout_verifications WHERE user_id = ${userId}
    `);
    
    console.log('Existing verification count query result:', JSON.stringify(existingResult));
    
    if (existingResult.rows && existingResult.rows.length > 0 && existingResult.rows[0].count > 0) {
      console.log(`User ${userId} already has ${existingResult.rows[0].count} workout verifications. Skipping.`);
      return;
    }

    // Create an array of workout verifications with different dates
    // We'll create a streak going back from today
    const today = new Date();
    const workoutsToCreate = [];

    // Create workouts for the last 5 days (today and 4 days before)
    for (let i = 0; i < 5; i++) {
      const workoutDate = new Date();
      workoutDate.setDate(today.getDate() - i);
      
      const workoutType = ['Strength Training', 'Cardio', 'Basketball', 'Running', 'Weightlifting'][Math.floor(Math.random() * 5)];
      
      // Verified workouts (approved)
      workoutsToCreate.push({
        userId,
        title: `${workoutType} Workout`,
        workoutType,
        submissionDate: workoutDate,
        verificationStatus: 'approved',
        verificationDate: workoutDate,
        workoutDuration: 45,
        intensityLevel: 'moderate',
        location: 'home',
        notes: 'Great workout session',
        xpEarned: 50,
        verificationType: 'video',
        proofType: 'video',
        proofData: 'workout_video.mp4'
      });
    }

    // Create a workout from 7 days ago (to break the streak)
    const breakDate = new Date();
    breakDate.setDate(today.getDate() - 7);
    
    workoutsToCreate.push({
      userId,
      title: 'Push Day Workout',
      workoutType: 'Strength Training',
      submissionDate: breakDate,
      verificationStatus: 'approved',
      verificationDate: breakDate,
      workoutDuration: 30,
      intensityLevel: 'high',
      location: 'gym',
      notes: 'Intense workout',
      xpEarned: 40,
      verificationType: 'video',
      proofType: 'video',
      proofData: 'workout_video.mp4'
    });

    // Create a workout from 8 days ago (to build previous streak)
    const prevStreakDate = new Date();
    prevStreakDate.setDate(today.getDate() - 8);
    
    workoutsToCreate.push({
      userId,
      title: 'Running Session',
      workoutType: 'Cardio',
      submissionDate: prevStreakDate,
      verificationStatus: 'approved',
      verificationDate: prevStreakDate,
      workoutDuration: 60,
      intensityLevel: 'moderate',
      location: 'outdoor',
      notes: 'Morning run',
      xpEarned: 60,
      verificationType: 'gps',
      proofType: 'screenshot',
      proofData: 'run_screenshot.jpg'
    });

    // Create a pending workout for today
    const pendingWorkout = {
      userId,
      title: 'Agility Training',
      workoutType: 'Football',
      submissionDate: today,
      verificationStatus: 'pending',
      workoutDuration: 45,
      intensityLevel: 'moderate',
      location: 'field',
      notes: 'Footwork drills',
      xpEarned: 0,
      verificationType: 'video',
      proofType: 'video',
      proofData: 'agility_drills.mp4'
    };
    workoutsToCreate.push(pendingWorkout);

    // Create a rejected workout from 10 days ago
    const rejectedDate = new Date();
    rejectedDate.setDate(today.getDate() - 10);
    
    const rejectedWorkout = {
      userId,
      title: 'Weight Training',
      workoutType: 'Strength',
      submissionDate: rejectedDate,
      verificationStatus: 'rejected',
      verificationDate: new Date(rejectedDate.getTime() + 3600000), // 1 hour later
      rejectionReason: 'Incomplete video footage',
      workoutDuration: 50,
      intensityLevel: 'high',
      location: 'gym',
      notes: 'Focus on form',
      xpEarned: 0,
      verificationType: 'video',
      proofType: 'video',
      proofData: 'weights.mp4'
    };
    workoutsToCreate.push(rejectedWorkout);

    // Insert all workout verifications
    for (const workout of workoutsToCreate) {
      await db.execute(sql`
        INSERT INTO workout_verifications (
          user_id, title, workout_type, submission_date, verification_status, 
          verification_date, workout_duration, intensity_level, location, notes, 
          xp_earned, verification_method, proof_type, proof_data, rejection_reason
        ) VALUES (
          ${workout.userId}, ${workout.title}, ${workout.workoutType}, ${workout.submissionDate}, 
          ${workout.verificationStatus}, ${workout.verificationDate}, ${workout.workoutDuration}, 
          ${workout.intensityLevel}, ${workout.location}, ${workout.notes}, ${workout.xpEarned},
          ${workout.verificationType}, ${workout.proofType}, ${workout.proofData}, ${workout.rejectionReason}
        )
      `);
    }

    console.log(`Created ${workoutsToCreate.length} test workout verifications for user ID: ${userId}`);
    
    // Also update the star path verified workout count if it exists
    const starPathExistsResult = await db.execute(sql`
      SELECT COUNT(*) as count FROM athlete_star_path WHERE user_id = ${userId}
    `);
    console.log('Star path check result:', JSON.stringify(starPathExistsResult));
    
    if (starPathExistsResult.rows && starPathExistsResult.rows.length > 0 && starPathExistsResult.rows[0].count > 0) {
      await db.execute(sql`
        UPDATE athlete_star_path 
        SET verified_workouts = (
          SELECT COUNT(*) FROM workout_verifications 
          WHERE user_id = ${userId} AND verification_status = 'approved'
        )
        WHERE user_id = ${userId}
      `);
      console.log('Updated star path verified workouts count');
    } else {
      console.log('No star path found for this user, skipped updating verified workouts count');
    }
    
    console.log('Test data creation completed successfully');
    
  } catch (error) {
    console.error('Error creating test workout data:', error);
  }
}

// Run the function for the admin user (ID 4)
createTestWorkoutData(4)
  .then(() => {
    console.log('Script completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('Script failed:', err);
    process.exit(1);
  });