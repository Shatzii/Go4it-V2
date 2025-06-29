// Fix Cartographer and start the application
const { exec } = require('child_process');

// Run the cartographer fix first
exec('node fix-cartographer.cjs', (error, stdout, stderr) => {
  if (error) {
    console.error(`Cartographer fix error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Cartographer fix stderr: ${stderr}`);
  }
  console.log(`Cartographer fix stdout: ${stdout}`);

  // Now start the application using custom start script
  console.log('Starting application...');
  exec('node start-app.cjs', (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
  });
});